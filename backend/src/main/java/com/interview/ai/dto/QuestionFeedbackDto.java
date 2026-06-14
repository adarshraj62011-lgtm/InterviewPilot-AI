package com.interview.ai.dto;

public class QuestionFeedbackDto {
    private Long questionId;
    private String questionText;
    private String candidateAnswer;
    private int score; // out of 100
    private String feedback;

    public QuestionFeedbackDto() {}

    public QuestionFeedbackDto(Long questionId, String questionText, String candidateAnswer, int score, String feedback) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.candidateAnswer = candidateAnswer;
        this.score = score;
        this.feedback = feedback;
    }

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getCandidateAnswer() { return candidateAnswer; }
    public void setCandidateAnswer(String candidateAnswer) { this.candidateAnswer = candidateAnswer; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
}
