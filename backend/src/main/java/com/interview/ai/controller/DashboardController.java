package com.interview.ai.controller;

import com.interview.ai.service.DashboardService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/history")
    public ResponseEntity<?> history(Principal principal) {
        return respond(() -> dashboardService.history(principal.getName()));
    }

    @GetMapping("/score-trend")
    public ResponseEntity<?> scoreTrend(Principal principal) {
        return respond(() -> dashboardService.scoreTrend(principal.getName()));
    }

    @GetMapping("/topics")
    public ResponseEntity<?> topics(Principal principal) {
        return respond(() -> dashboardService.topicPerformance(principal.getName()));
    }

    @GetMapping("/reports/{interviewId}.pdf")
    public ResponseEntity<?> report(Principal principal, @PathVariable Long interviewId) {
        try {
            byte[] pdf = dashboardService.createInterviewReport(interviewId, principal.getName());
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            ContentDisposition.attachment().filename("interview-report-" + interviewId + ".pdf").build().toString())
                    .body(pdf);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private ResponseEntity<?> respond(java.util.concurrent.Callable<?> action) {
        try {
            return ResponseEntity.ok(action.call());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
