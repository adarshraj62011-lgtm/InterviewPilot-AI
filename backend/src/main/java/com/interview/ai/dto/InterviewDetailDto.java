package com.interview.ai.dto;

import com.interview.ai.entity.Interview;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class InterviewDetailDto {
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
    private List<QuestionDetailDto> questionDetails;

    public InterviewDetailDto(Interview interview, List<QuestionDetailDto> questionDetails) {
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
        this.questionDetails = questionDetails;
    }
}
