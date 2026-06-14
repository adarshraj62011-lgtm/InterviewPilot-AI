package com.interview.ai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false)
    private Interview interview;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "question_type", nullable = false, length = 50)
    private String questionType; // MCQ, SUBJECTIVE, CODING

    @Column(columnDefinition = "TEXT")
    private String options; // JSON string of options, e.g., ["option A", "option B"]

    @Column(name = "correct_option")
    private String correctOption; // For MCQ verification

    @Column(nullable = false, length = 50)
    private String difficulty;

    @Column(nullable = false)
    private int points = 10;
}
