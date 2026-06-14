package com.interview.ai.dto;

import com.interview.ai.entity.CandidateAnswer;

public class AnswerResponseDto {
    private Long questionId;
    private String submittedAnswer;
    private int score;
    private String feedback;
    private int timeTakenSeconds;

    public AnswerResponseDto(CandidateAnswer answer) {
        this.questionId = answer.getQuestion().getId();
        this.submittedAnswer = answer.getSubmittedAnswer();
        this.score = answer.getScore();
        this.feedback = answer.getFeedback();
        this.timeTakenSeconds = answer.getTimeTakenSeconds();
    }

    public Long getQuestionId() { return questionId; }
    public String getSubmittedAnswer() { return submittedAnswer; }
    public int getScore() { return score; }
    public String getFeedback() { return feedback; }
    public int getTimeTakenSeconds() { return timeTakenSeconds; }
}
