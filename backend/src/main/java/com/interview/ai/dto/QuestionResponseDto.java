package com.interview.ai.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interview.ai.entity.Question;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
public class QuestionResponseDto {
    private Long id;
    private String questionText;
    private String questionType; // MCQ, SUBJECTIVE, CODING
    private List<String> options;
    private String difficulty;
    private int points;

    public QuestionResponseDto(Question question) {
        this.id = question.getId();
        this.questionText = question.getQuestionText();
        this.questionType = question.getQuestionType();
        this.difficulty = question.getDifficulty();
        this.points = question.getPoints();
        
        // Parse options JSON list
        if (question.getOptions() != null && !question.getOptions().isEmpty()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                this.options = mapper.readValue(question.getOptions(), new TypeReference<List<String>>() {});
            } catch (Exception e) {
                this.options = Collections.emptyList();
            }
        } else {
            this.options = null;
        }
    }
}
