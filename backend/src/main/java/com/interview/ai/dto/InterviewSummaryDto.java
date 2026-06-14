package com.interview.ai.dto;

import com.interview.ai.entity.Interview;
import java.time.LocalDateTime;

public class InterviewSummaryDto {
    private Long id;
    private String candidateUsername;
    private String domain;
    private String difficulty;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private int totalScore;
    private int maxScore;

    public InterviewSummaryDto() {}

    public InterviewSummaryDto(Interview interview) {
        this.id = interview.getId();
        this.candidateUsername = interview.getCandidate().getUsername();
        this.domain = interview.getDomain();
        this.difficulty = interview.getDifficulty();
        this.startedAt = interview.getCreatedAt();
        this.completedAt = "COMPLETED".equalsIgnoreCase(interview.getStatus())
                ? interview.getUpdatedAt()
                : null;
        this.totalScore = interview.getOverallScore() == null ? 0 : interview.getOverallScore();
        this.maxScore = 100;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCandidateUsername() { return candidateUsername; }
    public void setCandidateUsername(String candidateUsername) { this.candidateUsername = candidateUsername; }
    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public int getTotalScore() { return totalScore; }
    public void setTotalScore(int totalScore) { this.totalScore = totalScore; }
    public int getMaxScore() { return maxScore; }
    public void setMaxScore(int maxScore) { this.maxScore = maxScore; }
}
