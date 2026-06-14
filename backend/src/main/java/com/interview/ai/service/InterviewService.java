package com.interview.ai.service;

import com.interview.ai.entity.*;
import com.interview.ai.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import com.interview.ai.dto.QuestionFeedbackDto;
import com.interview.ai.dto.InterviewAnalyticsDto;

@Service
public class InterviewService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private CandidateAnswerRepository candidateAnswerRepository;

    @Autowired
    private AiService aiService;

    @Transactional
    public Interview startInterview(String domain, String difficulty, String username) {
        User candidate = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: Candidate not found with username: " + username));

        // Create new interview session
        Interview interview = Interview.builder()
                .candidate(candidate)
                .domain(domain)
                .difficulty(difficulty)
                .status("IN_PROGRESS")
                .proctoringViolations(0)
                .build();

        Interview savedInterview = interviewRepository.save(interview);

        // Call AI Service to generate questions
        List<Question> questions = aiService.generateQuestions(domain, difficulty, savedInterview);
        questionRepository.saveAll(questions);

        return savedInterview;
    }

    @Transactional
    public CandidateAnswer saveAnswer(Long interviewId, Long questionId, String submittedAnswer, int timeTakenSeconds, String username) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Error: Interview not found with ID: " + interviewId));

        if (!interview.getCandidate().getUsername().equals(username)) {
            throw new RuntimeException("Error: Unauthorized to answer questions for this interview session.");
        }

        if (!"IN_PROGRESS".equalsIgnoreCase(interview.getStatus())) {
            throw new RuntimeException("Error: This interview session is already closed.");
        }

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Error: Question not found with ID: " + questionId));

        if (!question.getInterview().getId().equals(interviewId)) {
            throw new RuntimeException("Error: Question does not belong to this interview session.");
        }

        // Evaluate answer using AI Service
        Map<String, Object> evaluation = aiService.evaluateAnswer(question, submittedAnswer);
        int score = (int) evaluation.get("score");
        String feedback = (String) evaluation.get("feedback");

        // Save or update candidate answer
        CandidateAnswer answer = candidateAnswerRepository.findByInterviewIdAndQuestionId(interviewId, questionId)
                .orElse(CandidateAnswer.builder()
                        .interview(interview)
                        .question(question)
                        .build());

        answer.setSubmittedAnswer(submittedAnswer);
        answer.setScore(score);
        answer.setFeedback(feedback);
        answer.setTimeTakenSeconds(timeTakenSeconds);

        return candidateAnswerRepository.save(answer);
    }

    @Transactional
    public void incrementProctoringViolations(Long interviewId, String username) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Error: Interview not found with ID: " + interviewId));

        if (!interview.getCandidate().getUsername().equals(username)) {
            throw new RuntimeException("Error: Unauthorized modification of this interview session.");
        }

        if (!"IN_PROGRESS".equalsIgnoreCase(interview.getStatus())) {
            return; // Don't track if completed
        }

        interview.setProctoringViolations(interview.getProctoringViolations() + 1);
        interviewRepository.save(interview);
    }

    @Transactional(readOnly = true)
    public InterviewAnalyticsDto getAnalyticsForInterview(Long interviewId, String username) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Error: Interview not found with ID: " + interviewId));
        if (!interview.getCandidate().getUsername().equals(username)) {
            throw new RuntimeException("Error: Unauthorized access to analytics for this interview.");
        }
        List<CandidateAnswer> answers = candidateAnswerRepository.findByInterviewId(interviewId);
        // Build score trend list in order of question IDs
        List<Integer> scoreTrend = answers.stream()
                .sorted((a, b) -> a.getQuestion().getId().compareTo(b.getQuestion().getId()))
                .map(CandidateAnswer::getScore)
                .collect(java.util.stream.Collectors.toList());
        return new InterviewAnalyticsDto(
                interviewId,
                scoreTrend,
                null, // topicScores placeholder
                interview.getOverallScore() == null ? 0 : interview.getOverallScore(),
                interview.getProctoringViolations()
        );
    }

    @Transactional(readOnly = true)
    public List<QuestionFeedbackDto> getFeedbackForInterview(Long interviewId, String username) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Error: Interview not found with ID: " + interviewId));
        if (!interview.getCandidate().getUsername().equals(username)) {
            throw new RuntimeException("Error: Unauthorized access to feedback for this interview.");
        }
        List<CandidateAnswer> answers = candidateAnswerRepository.findByInterviewId(interviewId);
        return answers.stream().map(a -> new QuestionFeedbackDto(
                a.getQuestion().getId(),
                a.getQuestion().getQuestionText(),
                a.getSubmittedAnswer(),
                a.getScore(),
                a.getFeedback()))
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional
    public Interview submitInterview(Long interviewId, String username) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Error: Interview not found with ID: " + interviewId));

        if (!interview.getCandidate().getUsername().equals(username)) {
            throw new RuntimeException("Error: Unauthorized submission.");
        }

        if (!"IN_PROGRESS".equalsIgnoreCase(interview.getStatus())) {
            return interview; // Already submitted
        }

        List<Question> questions = questionRepository.findByInterviewId(interviewId);
        List<CandidateAnswer> answers = candidateAnswerRepository.findByInterviewId(interviewId);

        // Grade unsubmitted questions as 0
        for (Question q : questions) {
            boolean answered = answers.stream().anyMatch(a -> a.getQuestion().getId().equals(q.getId()));
            if (!answered) {
                CandidateAnswer blankAnswer = CandidateAnswer.builder()
                        .interview(interview)
                        .question(q)
                        .submittedAnswer("")
                        .score(0)
                        .feedback("No answer was submitted during the session.")
                        .timeTakenSeconds(0)
                        .build();
                candidateAnswerRepository.save(blankAnswer);
                answers.add(blankAnswer);
            }
        }

        // Calculate average score
        int totalScore = answers.stream().mapToInt(CandidateAnswer::getScore).sum();
        int averageScore = questions.isEmpty() ? 0 : totalScore / questions.size();

        // Call AI Service to evaluate the overall interview performance
        Map<String, String> overallEvaluation = aiService.evaluateOverallSession(questions, answers);

        interview.setOverallScore(averageScore);
        interview.setOverallFeedback(overallEvaluation.get("overallFeedback"));
        interview.setStrengths(overallEvaluation.get("strengths"));
        interview.setWeaknesses(overallEvaluation.get("weaknesses"));
        interview.setSuggestions(overallEvaluation.get("suggestions"));
        interview.setStatus("COMPLETED");

        return interviewRepository.save(interview);
    }

    @Transactional(readOnly = true)
    public List<Question> getQuestionsForInterview(Long interviewId) {
        return questionRepository.findByInterviewId(interviewId);
    }
}
