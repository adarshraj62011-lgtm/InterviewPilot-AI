package com.interview.ai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name = "experience_years", nullable = false)
    private int experienceYears = 0;

    @Column(name = "experience_level", length = 50)
    private String experienceLevel;

    @Column(name = "target_domain", length = 100)
    private String targetDomain;

    @Column(columnDefinition = "TEXT")
    private String projects;

    @Column(name = "role_fit_percentage")
    private Integer roleFitPercentage;

    @Column(name = "resume_url")
    private String resumeUrl;

    @Lob
    @Column(name = "resume_text")
    private String resumeText;
}
