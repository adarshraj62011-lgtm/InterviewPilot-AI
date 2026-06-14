package com.interview.ai.dto;

import com.interview.ai.entity.Interview;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class InterviewResponseDto {
    private Long id;
    private Long candidateId;
    private String domain;
    private String difficulty;
    private String status;
    private Integer overallScore;
    private String overallFeedback;
    private String strengths;
    private String weaknesses;
    private String suggestions;
    private int proctoringViolations;
    private LocalDateTime createdAt;
    private List<QuestionResponseDto> questions;

    public InterviewResponseDto(Interview interview, List<com.interview.ai.entity.Question> questions) {
        this.id = interview.getId();
        this.candidateId = interview.getCandidate().getId();
        this.domain = interview.getDomain();
        this.difficulty = interview.getDifficulty();
        this.status = interview.getStatus();
        this.overallScore = interview.getOverallScore();
        this.overallFeedback = interview.getOverallFeedback();
        this.strengths = interview.getStrengths();
        this.weaknesses = interview.getWeaknesses();
        this.suggestions = interview.getSuggestions();
        this.proctoringViolations = interview.getProctoringViolations();
        this.createdAt = interview.getCreatedAt();
        
        if (questions != null) {
            this.questions = questions.stream()
                    .map(QuestionResponseDto::new)
                    .collect(Collectors.toList());
        }
    }
}
