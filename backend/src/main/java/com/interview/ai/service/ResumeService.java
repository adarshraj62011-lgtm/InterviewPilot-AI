package com.interview.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interview.ai.dto.ResumeAnalysisDto;
import com.interview.ai.entity.Profile;
import com.interview.ai.entity.Role;
import com.interview.ai.entity.User;
import com.interview.ai.repository.ProfileRepository;
import com.interview.ai.repository.UserRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeService {

    private static final Map<String, List<String>> DOMAIN_SKILLS = Map.of(
            "Backend Development", List.of("java", "spring", "spring boot", "rest", "sql", "mysql", "postgresql", "microservices", "hibernate", "jpa"),
            "Frontend Development", List.of("javascript", "typescript", "react", "angular", "vue", "html", "css", "tailwind"),
            "Data Science", List.of("python", "pandas", "numpy", "machine learning", "tensorflow", "pytorch", "sql", "statistics"),
            "DevOps & Cloud", List.of("aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "terraform", "linux"),
            "Mobile Development", List.of("android", "kotlin", "swift", "ios", "flutter", "react native")
    );

    private static final List<String> KNOWN_SKILLS = DOMAIN_SKILLS.values().stream()
            .flatMap(List::stream)
            .distinct()
            .toList();

    private final AiService aiService;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final ObjectMapper objectMapper;

    public ResumeService(AiService aiService, UserRepository userRepository,
                         ProfileRepository profileRepository, ObjectMapper objectMapper) {
        this.aiService = aiService;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.objectMapper = objectMapper;
    }

    public String extractText(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select a non-empty PDF file.");
        }
        String filename = file.getOriginalFilename();
        if (!"application/pdf".equalsIgnoreCase(file.getContentType())
                && (filename == null || !filename.toLowerCase(Locale.ROOT).endsWith(".pdf"))) {
            throw new IllegalArgumentException("Only PDF resumes are supported.");
        }
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            if (document.isEncrypted()) {
                throw new IllegalArgumentException("Password-protected PDFs are not supported.");
            }
            String text = new PDFTextStripper().getText(document).trim();
            if (text.isBlank()) {
                throw new IllegalArgumentException("No readable text was found in this PDF.");
            }
            return text;
        }
    }

    @Transactional
    public ResumeAnalysisDto analyzeAndSave(String resumeText, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Candidate account was not found."));
        if (user.getRole() != Role.CANDIDATE) {
            throw new IllegalArgumentException("Resume analysis is available only for candidates.");
        }

        ResumeAnalysisDto analysis = parseAiAnalysis(aiService.analyzeResume(resumeText), resumeText);
        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseGet(() -> Profile.builder().user(user).experienceYears(0).build());
        profile.setSkills(String.join(", ", analysis.getSkills()));
        profile.setExperienceYears(analysis.getExperienceYears());
        profile.setExperienceLevel(analysis.getExperienceLevel());
        profile.setTargetDomain(analysis.getDomainSuggestion());
        profile.setProjects(String.join("\n", analysis.getProjects()));
        profile.setRoleFitPercentage(analysis.getRoleFitPercentage());
        profile.setResumeText(resumeText);
        profileRepository.save(profile);
        return analysis;
    }

    private ResumeAnalysisDto parseAiAnalysis(String rawJson, String resumeText) {
        Set<String> skills = new LinkedHashSet<>();
        List<String> projects = new ArrayList<>();
        int experienceYears = 0;
        String suggestedDomain = null;

        try {
            String cleaned = rawJson == null ? "{}" : rawJson
                    .replaceFirst("^\\s*```(?:json)?", "")
                    .replaceFirst("```\\s*$", "")
                    .trim();
            JsonNode root = objectMapper.readTree(cleaned);
            addTextValues(root.path("skills"), skills);
            addTextValues(root.path("projects"), projects);
            experienceYears = Math.max(0, root.path("experienceYears").asInt(0));
            suggestedDomain = textOrNull(root.path("domainSuggestion"));
        } catch (Exception ignored) {
            // The deterministic parser below keeps resume upload useful offline.
        }

        String lowerResume = resumeText.toLowerCase(Locale.ROOT);
        for (String knownSkill : KNOWN_SKILLS) {
            if (containsTerm(lowerResume, knownSkill)) {
                skills.add(displaySkill(knownSkill));
            }
        }
        if (experienceYears == 0) {
            experienceYears = extractExperienceYears(resumeText);
        }
        if (projects.isEmpty()) {
            projects.addAll(extractProjects(resumeText));
        }

        String domain = normalizeDomain(suggestedDomain);
        if (domain == null || "General".equalsIgnoreCase(domain)) {
            domain = suggestDomain(skills);
        }
        int roleFit = calculateRoleFit(skills, experienceYears, projects, domain);

        ResumeAnalysisDto result = new ResumeAnalysisDto();
        result.setSkills(new ArrayList<>(skills));
        result.setExperienceYears(experienceYears);
        result.setExperienceLevel(experienceLevel(experienceYears));
        result.setProjects(projects.stream().limit(6).toList());
        result.setDomainSuggestion(domain);
        result.setRoleFitPercentage(roleFit);
        return result;
    }

    private void addTextValues(JsonNode node, java.util.Collection<String> target) {
        if (node.isArray()) {
            node.forEach(value -> {
                if (!value.asText().isBlank()) target.add(value.asText().trim());
            });
        } else if (node.isTextual()) {
            Arrays.stream(node.asText().split("[,;\\n]"))
                    .map(String::trim).filter(value -> !value.isBlank()).forEach(target::add);
        }
    }

    private String textOrNull(JsonNode node) {
        return node.isTextual() && !node.asText().isBlank() ? node.asText().trim() : null;
    }

    private int extractExperienceYears(String text) {
        Matcher matcher = Pattern.compile("(?i)(\\d{1,2})(?:\\+)?\\s*(?:years?|yrs?)\\s+(?:of\\s+)?experience").matcher(text);
        int years = 0;
        while (matcher.find()) years = Math.max(years, Integer.parseInt(matcher.group(1)));
        return Math.min(years, 50);
    }

    private List<String> extractProjects(String text) {
        List<String> projects = new ArrayList<>();
        boolean inProjects = false;
        for (String rawLine : text.split("\\R")) {
            String line = rawLine.trim().replaceFirst("^[\\u2022*\\-]+\\s*", "");
            if (line.matches("(?i)^projects?(?:\\s*/\\s*experience)?\\s*:?.*$")) {
                inProjects = true;
                continue;
            }
            if (inProjects && line.matches("(?i)^(education|skills|experience|certifications?|achievements?|languages?)\\s*:?.*$")) {
                break;
            }
            if (inProjects && line.length() >= 8 && line.length() <= 180) projects.add(line);
            if (projects.size() == 6) break;
        }
        return projects;
    }

    private String suggestDomain(Set<String> skills) {
        String normalized = String.join(" ", skills).toLowerCase(Locale.ROOT);
        return DOMAIN_SKILLS.entrySet().stream()
                .max(java.util.Comparator.comparingLong(entry -> entry.getValue().stream()
                        .filter(skill -> containsTerm(normalized, skill)).count()))
                .filter(entry -> entry.getValue().stream().anyMatch(skill -> containsTerm(normalized, skill)))
                .map(Map.Entry::getKey)
                .orElse("General Software Engineering");
    }

    private int calculateRoleFit(Set<String> skills, int years, List<String> projects, String domain) {
        List<String> expected = DOMAIN_SKILLS.getOrDefault(domain, List.of());
        String normalized = String.join(" ", skills).toLowerCase(Locale.ROOT);
        long matches = expected.stream().filter(skill -> containsTerm(normalized, skill)).count();
        double skillScore = expected.isEmpty() ? Math.min(skills.size() * 6.0, 55) : (matches * 65.0 / expected.size());
        double experienceScore = Math.min(years, 5) * 5.0;
        double projectScore = Math.min(projects.size(), 2) * 5.0;
        return (int) Math.round(Math.min(100, 10 + skillScore + experienceScore + projectScore));
    }

    private String experienceLevel(int years) {
        if (years >= 6) return "SENIOR";
        if (years >= 3) return "MID";
        return "ENTRY";
    }

    private String normalizeDomain(String domain) {
        if (domain == null) return null;
        String lower = domain.toLowerCase(Locale.ROOT);
        if (lower.contains("back") || lower.contains("java") || lower.contains("spring")) return "Backend Development";
        if (lower.contains("front") || lower.contains("react") || lower.contains("web")) return "Frontend Development";
        if (lower.contains("data") || lower.contains("machine") || lower.contains("ai")) return "Data Science";
        if (lower.contains("devops") || lower.contains("cloud")) return "DevOps & Cloud";
        if (lower.contains("mobile") || lower.contains("android") || lower.contains("ios")) return "Mobile Development";
        return domain;
    }

    private boolean containsTerm(String text, String term) {
        return Pattern.compile("(?<![a-z0-9])" + Pattern.quote(term.toLowerCase(Locale.ROOT)) + "(?![a-z0-9])")
                .matcher(text).find();
    }

    private String displaySkill(String skill) {
        return switch (skill) {
            case "java" -> "Java";
            case "spring", "spring boot" -> "Spring Boot";
            case "rest" -> "REST";
            case "sql" -> "SQL";
            case "mysql" -> "MySQL";
            case "postgresql" -> "PostgreSQL";
            case "jpa" -> "JPA";
            case "html" -> "HTML";
            case "css" -> "CSS";
            case "aws" -> "AWS";
            case "gcp" -> "GCP";
            default -> Arrays.stream(skill.split(" "))
                    .map(word -> Character.toUpperCase(word.charAt(0)) + word.substring(1))
                    .reduce((left, right) -> left + " " + right).orElse(skill);
        };
    }
}
