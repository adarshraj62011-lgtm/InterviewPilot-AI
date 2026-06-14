package com.interview.ai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StartInterviewRequest {
    @NotBlank(message = "Domain is required")
    private String domain;

    @NotBlank(message = "Difficulty is required")
    private String difficulty; // EASY, MEDIUM, HARD
}
