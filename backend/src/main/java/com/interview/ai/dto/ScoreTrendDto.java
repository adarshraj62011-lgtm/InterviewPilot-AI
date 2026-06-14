package com.interview.ai.dto;

import java.time.LocalDate;

public class ScoreTrendDto {
    private LocalDate date;
    private int score;
    private int maxScore;

    public ScoreTrendDto() {}

    public ScoreTrendDto(LocalDate date, int score, int maxScore) {
        this.date = date;
        this.score = score;
        this.maxScore = maxScore;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(int maxScore) {
        this.maxScore = maxScore;
    }
}
