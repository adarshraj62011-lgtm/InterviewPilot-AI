package com.interview.ai.dto;

public class CandidateComparisonDto {
    private Long candidateId;
    private String username;
    private String targetDomain;
    private String experienceLevel;
    private int roleFitPercentage;
    private int completedInterviews;
    private double averageScore;
    private int bestScore;
    private int proctoringViolations;

    public Long getCandidateId() { return candidateId; }
    public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getTargetDomain() { return targetDomain; }
    public void setTargetDomain(String targetDomain) { this.targetDomain = targetDomain; }
    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }
    public int getRoleFitPercentage() { return roleFitPercentage; }
    public void setRoleFitPercentage(int roleFitPercentage) { this.roleFitPercentage = roleFitPercentage; }
    public int getCompletedInterviews() { return completedInterviews; }
    public void setCompletedInterviews(int completedInterviews) { this.completedInterviews = completedInterviews; }
    public double getAverageScore() { return averageScore; }
    public void setAverageScore(double averageScore) { this.averageScore = averageScore; }
    public int getBestScore() { return bestScore; }
    public void setBestScore(int bestScore) { this.bestScore = bestScore; }
    public int getProctoringViolations() { return proctoringViolations; }
    public void setProctoringViolations(int proctoringViolations) { this.proctoringViolations = proctoringViolations; }
}
