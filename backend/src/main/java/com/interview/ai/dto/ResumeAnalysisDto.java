package com.interview.ai.dto;

import java.util.ArrayList;
import java.util.List;

public class ResumeAnalysisDto {
    private List<String> skills = new ArrayList<>();
    private int experienceYears;
    private String experienceLevel;
    private List<String> projects = new ArrayList<>();
    private String domainSuggestion;
    private int roleFitPercentage;

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    public int getExperienceYears() { return experienceYears; }
    public void setExperienceYears(int experienceYears) { this.experienceYears = experienceYears; }
    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }
    public List<String> getProjects() { return projects; }
    public void setProjects(List<String> projects) { this.projects = projects; }
    public String getDomainSuggestion() { return domainSuggestion; }
    public void setDomainSuggestion(String domainSuggestion) { this.domainSuggestion = domainSuggestion; }
    public int getRoleFitPercentage() { return roleFitPercentage; }
    public void setRoleFitPercentage(int roleFitPercentage) { this.roleFitPercentage = roleFitPercentage; }
}
