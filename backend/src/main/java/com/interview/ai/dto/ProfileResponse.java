package com.interview.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileResponse {
    private Long id;
    private Long userId;
    private String username;
    private String email;
    private String role;
    private String skills;
    private int experienceYears;
    private String experienceLevel;
    private String targetDomain;
    private String resumeUrl;
}
