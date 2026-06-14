package com.interview.ai.dto;

import com.interview.ai.entity.Question;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class QuestionDetailDto {
    private Long id;
    private String questionText;
    private String questionType; // MCQ, SUBJECTIVE, CODING
    private List<String> options;
    private String difficulty;
    private int points;
    private String submittedAnswer;
    private Integer score;
    private String feedback;

    public QuestionDetailDto(Question question, String submittedAnswer, Integer score, String feedback) {
        this.id = question.getId();
        this.questionText = question.getQuestionText();
        this.questionType = question.getQuestionType();
        this.difficulty = question.getDifficulty();
        this.points = question.getPoints();
        if (question.getOptions() != null && !question.getOptions().isEmpty()) {
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                this.options = mapper.readValue(question.getOptions(), new com.fasterxml.jackson.core.type.TypeReference<List<String>>() {});
            } catch (Exception e) {
                this.options = null;
            }
        } else {
            this.options = null;
        }
        this.submittedAnswer = submittedAnswer;
        this.score = score;
        this.feedback = feedback;
    }
}
