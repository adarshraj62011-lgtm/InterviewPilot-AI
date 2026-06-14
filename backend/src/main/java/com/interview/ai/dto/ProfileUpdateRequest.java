package com.interview.ai.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String skills;
    private Integer experienceYears;
    private String experienceLevel; // ENTRY, MID, SENIOR
    private String targetDomain;
}
