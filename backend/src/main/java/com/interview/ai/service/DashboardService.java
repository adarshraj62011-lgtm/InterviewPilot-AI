package com.interview.ai.service;

import com.interview.ai.dto.CandidateComparisonDto;
import com.interview.ai.dto.InterviewSummaryDto;
import com.interview.ai.dto.ScoreTrendDto;
import com.interview.ai.dto.TopicPerformanceDto;
import com.interview.ai.entity.CandidateAnswer;
import com.interview.ai.entity.Interview;
import com.interview.ai.entity.Profile;
import com.interview.ai.entity.Role;
import com.interview.ai.entity.User;
import com.interview.ai.repository.CandidateAnswerRepository;
import com.interview.ai.repository.InterviewRepository;
import com.interview.ai.repository.ProfileRepository;
import com.interview.ai.repository.UserRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final InterviewRepository interviewRepository;
    private final CandidateAnswerRepository answerRepository;

    public DashboardService(UserRepository userRepository, ProfileRepository profileRepository,
                            InterviewRepository interviewRepository, CandidateAnswerRepository answerRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.interviewRepository = interviewRepository;
        this.answerRepository = answerRepository;
    }

    @Transactional(readOnly = true)
    public List<InterviewSummaryDto> history(String username) {
        User candidate = requireCandidate(username);
        return interviewRepository.findByCandidateIdOrderByCreatedAtDesc(candidate.getId()).stream()
                .map(InterviewSummaryDto::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ScoreTrendDto> scoreTrend(String username) {
        User candidate = requireCandidate(username);
        return completedInterviews(candidate.getId()).stream()
                .map(interview -> new ScoreTrendDto(
                        interview.getCreatedAt().toLocalDate(),
                        safeScore(interview),
                        100))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TopicPerformanceDto> topicPerformance(String username) {
        User candidate = requireCandidate(username);
        Map<String, List<Integer>> scoresByDomain = new LinkedHashMap<>();
        for (Interview interview : completedInterviews(candidate.getId())) {
            scoresByDomain.computeIfAbsent(interview.getDomain(), ignored -> new ArrayList<>())
                    .add(safeScore(interview));
        }
        return scoresByDomain.entrySet().stream()
                .map(entry -> new TopicPerformanceDto(
                        entry.getKey(),
                        round(entry.getValue().stream().mapToInt(Integer::intValue).average().orElse(0)),
                        entry.getValue().size()))
                .toList();
    }

    @Transactional(readOnly = true)
    public byte[] createInterviewReport(Long interviewId, String username) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new IllegalArgumentException("Interview was not found."));
        User requester = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User was not found."));
        boolean owner = interview.getCandidate().getId().equals(requester.getId());
        boolean recruiter = requester.getRole() == Role.RECRUITER || requester.getRole() == Role.ADMIN;
        if (!owner && !recruiter) {
            throw new IllegalArgumentException("You are not allowed to download this report.");
        }

        List<CandidateAnswer> answers = answerRepository.findByInterviewId(interviewId);
        try {
            return renderPdf(interview, answers);
        } catch (IOException e) {
            throw new IllegalStateException("Could not generate the interview report.", e);
        }
    }

    @Transactional(readOnly = true)
    public List<CandidateComparisonDto> compareCandidates(List<Long> candidateIds) {
        List<User> candidates = candidateIds == null || candidateIds.isEmpty()
                ? userRepository.findByRoleOrderByUsernameAsc(Role.CANDIDATE)
                : userRepository.findAllById(candidateIds).stream()
                    .filter(user -> user.getRole() == Role.CANDIDATE)
                    .toList();

        return candidates.stream().map(this::comparisonFor).toList();
    }

    private CandidateComparisonDto comparisonFor(User candidate) {
        List<Interview> interviews = completedInterviews(candidate.getId());
        Profile profile = profileRepository.findByUserId(candidate.getId()).orElse(null);
        CandidateComparisonDto dto = new CandidateComparisonDto();
        dto.setCandidateId(candidate.getId());
        dto.setUsername(candidate.getUsername());
        dto.setTargetDomain(profile == null ? null : profile.getTargetDomain());
        dto.setExperienceLevel(profile == null ? null : profile.getExperienceLevel());
        dto.setRoleFitPercentage(profile == null || profile.getRoleFitPercentage() == null ? 0 : profile.getRoleFitPercentage());
        dto.setCompletedInterviews(interviews.size());
        dto.setAverageScore(round(interviews.stream().mapToInt(this::safeScore).average().orElse(0)));
        dto.setBestScore(interviews.stream().mapToInt(this::safeScore).max().orElse(0));
        dto.setProctoringViolations(interviews.stream().mapToInt(Interview::getProctoringViolations).sum());
        return dto;
    }

    private byte[] renderPdf(Interview interview, List<CandidateAnswer> answers) throws IOException {
        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(document);
            writer.title("AI Mock Interview Report");
            writer.line("Candidate: " + interview.getCandidate().getUsername());
            writer.line("Domain: " + interview.getDomain());
            writer.line("Difficulty: " + interview.getDifficulty());
            writer.line("Date: " + interview.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm")));
            writer.line("Overall score: " + safeScore(interview) + "/100");
            writer.line("Proctoring violations: " + interview.getProctoringViolations());
            writer.gap();
            writer.heading("Overall feedback");
            writer.paragraph(valueOrFallback(interview.getOverallFeedback(), "No overall feedback available."));
            writer.heading("Strengths");
            writer.paragraph(valueOrFallback(interview.getStrengths(), "Not recorded."));
            writer.heading("Weaknesses");
            writer.paragraph(valueOrFallback(interview.getWeaknesses(), "Not recorded."));
            writer.heading("Suggestions");
            writer.paragraph(valueOrFallback(interview.getSuggestions(), "Not recorded."));

            int index = 1;
            for (CandidateAnswer answer : answers) {
                writer.heading("Question " + index++ + " - " + answer.getScore() + "/100");
                writer.paragraph(answer.getQuestion().getQuestionText());
                writer.line("Answer:");
                writer.paragraph(valueOrFallback(answer.getSubmittedAnswer(), "No answer submitted."));
                writer.line("Feedback:");
                writer.paragraph(valueOrFallback(answer.getFeedback(), "No feedback available."));
            }
            writer.close();
            document.save(output);
            return output.toByteArray();
        }
    }

    private User requireCandidate(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Candidate was not found."));
        if (user.getRole() != Role.CANDIDATE) {
            throw new IllegalArgumentException("Candidate dashboard is available only for candidates.");
        }
        return user;
    }

    private List<Interview> completedInterviews(Long candidateId) {
        return interviewRepository.findByCandidateIdAndStatusOrderByCreatedAtAsc(candidateId, "COMPLETED");
    }

    private int safeScore(Interview interview) {
        return interview.getOverallScore() == null ? 0 : interview.getOverallScore();
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private String valueOrFallback(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private static final class PdfWriter {
        private static final float MARGIN = 48;
        private static final float BOTTOM = 48;
        private static final float WIDTH = PDRectangle.A4.getWidth() - (MARGIN * 2);
        private final PDDocument document;
        private final PDType1Font regular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
        private final PDType1Font bold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
        private PDPageContentStream stream;
        private float y;

        private PdfWriter(PDDocument document) throws IOException {
            this.document = document;
            newPage();
        }

        private void title(String text) throws IOException {
            writeWrapped(text, bold, 18, 24);
            gap();
        }

        private void heading(String text) throws IOException {
            ensureSpace(28);
            writeWrapped(text, bold, 12, 17);
        }

        private void line(String text) throws IOException {
            writeWrapped(text, regular, 10, 14);
        }

        private void paragraph(String text) throws IOException {
            writeWrapped(text, regular, 9, 13);
            gap();
        }

        private void gap() {
            y -= 7;
        }

        private void writeWrapped(String text, PDType1Font font, float fontSize, float leading) throws IOException {
            for (String paragraph : text.replace('\t', ' ').split("\\R", -1)) {
                List<String> lines = wrap(paragraph, font, fontSize);
                if (lines.isEmpty()) lines = List.of("");
                for (String line : lines) {
                    ensureSpace(leading);
                    stream.beginText();
                    stream.setFont(font, fontSize);
                    stream.newLineAtOffset(MARGIN, y);
                    stream.showText(sanitize(line));
                    stream.endText();
                    y -= leading;
                }
            }
        }

        private List<String> wrap(String text, PDType1Font font, float fontSize) throws IOException {
            List<String> lines = new ArrayList<>();
            StringBuilder current = new StringBuilder();
            for (String word : text.trim().split("\\s+")) {
                String candidate = current.isEmpty() ? word : current + " " + word;
                if (font.getStringWidth(sanitize(candidate)) / 1000 * fontSize <= WIDTH) {
                    current = new StringBuilder(candidate);
                } else {
                    if (!current.isEmpty()) lines.add(current.toString());
                    current = new StringBuilder(word);
                }
            }
            if (!current.isEmpty()) lines.add(current.toString());
            return lines;
        }

        private String sanitize(String text) {
            return text.replaceAll("[^\\x20-\\x7E]", "?");
        }

        private void ensureSpace(float needed) throws IOException {
            if (y - needed < BOTTOM) newPage();
        }

        private void newPage() throws IOException {
            if (stream != null) stream.close();
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);
            stream = new PDPageContentStream(document, page);
            y = PDRectangle.A4.getHeight() - MARGIN;
        }

        private void close() throws IOException {
            if (stream != null) stream.close();
        }
    }
}
