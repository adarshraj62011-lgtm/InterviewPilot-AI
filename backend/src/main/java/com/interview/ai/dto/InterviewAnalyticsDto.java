package com.interview.ai.dto;

import java.util.List;
import java.util.Map;

/**
 * DTO representing aggregated analytics for an interview.
 * Includes score trend over time, per‑topic scores, total score, and proctoring violations.
 */
public class InterviewAnalyticsDto {
    private Long interviewId;
    private List<Integer> scoreTrend; // cumulative or per‑question scores
    private Map<String, Integer> topicScores; // placeholder for future topic breakdown
    private int totalScore;
    private int proctoringViolations;

    public InterviewAnalyticsDto() {}

    public InterviewAnalyticsDto(Long interviewId, List<Integer> scoreTrend, Map<String, Integer> topicScores, int totalScore, int proctoringViolations) {
        this.interviewId = interviewId;
        this.scoreTrend = scoreTrend;
        this.topicScores = topicScores;
        this.totalScore = totalScore;
        this.proctoringViolations = proctoringViolations;
    }

    public Long getInterviewId() {
        return interviewId;
    }
    public void setInterviewId(Long interviewId) {
        this.interviewId = interviewId;
    }
    public List<Integer> getScoreTrend() {
        return scoreTrend;
    }
    public void setScoreTrend(List<Integer> scoreTrend) {
        this.scoreTrend = scoreTrend;
    }
    public Map<String, Integer> getTopicScores() {
        return topicScores;
    }
    public void setTopicScores(Map<String, Integer> topicScores) {
        this.topicScores = topicScores;
    }
    public int getTotalScore() {
        return totalScore;
    }
    public void setTotalScore(int totalScore) {
        this.totalScore = totalScore;
    }
    public int getProctoringViolations() {
        return proctoringViolations;
    }
    public void setProctoringViolations(int proctoringViolations) {
        this.proctoringViolations = proctoringViolations;
    }
}
