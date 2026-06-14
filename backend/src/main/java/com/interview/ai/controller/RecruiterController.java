package com.interview.ai.controller;

import com.interview.ai.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
public class RecruiterController {

    private final DashboardService dashboardService;

    public RecruiterController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/candidates/compare")
    public ResponseEntity<?> compare(@RequestParam(required = false) List<Long> ids) {
        return ResponseEntity.ok(dashboardService.compareCandidates(ids));
    }
}
