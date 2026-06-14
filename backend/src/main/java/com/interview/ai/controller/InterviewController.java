package com.interview.ai.controller;

import com.interview.ai.dto.InterviewResponseDto;
import com.interview.ai.dto.AnswerResponseDto;
import com.interview.ai.dto.StartInterviewRequest;
import com.interview.ai.dto.SubmitAnswerRequest;
import com.interview.ai.entity.CandidateAnswer;
import com.interview.ai.entity.Interview;
import com.interview.ai.entity.Question;
import com.interview.ai.service.InterviewService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.interview.ai.dto.InterviewAnalyticsDto;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(origins = "*", maxAge = 3600)
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    @PostMapping("/start")
    public ResponseEntity<?> startInterview(Principal principal, @Valid @RequestBody StartInterviewRequest request) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            Interview interview = interviewService.startInterview(request.getDomain(), request.getDifficulty(), principal.getName());
            List<Question> questions = interviewService.getQuestionsForInterview(interview.getId());
            InterviewResponseDto responseDto = new InterviewResponseDto(interview, questions);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/answer")
    public ResponseEntity<?> submitAnswer(Principal principal, @PathVariable Long id, @Valid @RequestBody SubmitAnswerRequest request) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            CandidateAnswer answer = interviewService.saveAnswer(id, request.getQuestionId(), request.getSubmittedAnswer(), request.getTimeTakenSeconds(), principal.getName());
            return ResponseEntity.ok(new AnswerResponseDto(answer));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/violation")
    public ResponseEntity<?> logViolation(Principal principal, @PathVariable Long id) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            interviewService.incrementProctoringViolations(id, principal.getName());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitInterview(Principal principal, @PathVariable Long id) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            Interview interview = interviewService.submitInterview(id, principal.getName());
            List<Question> questions = interviewService.getQuestionsForInterview(interview.getId());
            return ResponseEntity.ok(new InterviewResponseDto(interview, questions));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/{id}/feedback")
    public ResponseEntity<?> getFeedback(Principal principal, @PathVariable Long id) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            List<com.interview.ai.dto.QuestionFeedbackDto> feedback = interviewService.getFeedbackForInterview(id, principal.getName());
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}/analytics")
    public ResponseEntity<?> getAnalytics(Principal principal, @PathVariable Long id) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            InterviewAnalyticsDto analytics = interviewService.getAnalyticsForInterview(id, principal.getName());
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
