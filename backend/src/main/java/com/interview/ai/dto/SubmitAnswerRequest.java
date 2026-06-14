package com.interview.ai.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubmitAnswerRequest {
    @NotNull(message = "Question ID is required")
    private Long questionId;

    private String submittedAnswer;

    private int timeTakenSeconds;
}
