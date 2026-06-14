package com.interview.ai.dto;

public class TopicPerformanceDto {
    private String topic;
    private double averageScore;
    private int questionCount;

    public TopicPerformanceDto() {}

    public TopicPerformanceDto(String topic, double averageScore, int questionCount) {
        this.topic = topic;
        this.averageScore = averageScore;
        this.questionCount = questionCount;
    }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    public double getAverageScore() { return averageScore; }
    public void setAverageScore(double averageScore) { this.averageScore = averageScore; }
    public int getQuestionCount() { return questionCount; }
    public void setQuestionCount(int questionCount) { this.questionCount = questionCount; }
}
