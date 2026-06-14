package com.interview.ai.controller;

import com.interview.ai.service.ResumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.Map;
import com.interview.ai.dto.ResumeAnalysisDto;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    /**
     * Endpoint to upload a PDF resume. It extracts raw text, forwards it to the
     * AI parsing logic, and returns a structured representation.
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(Principal principal, @RequestPart("file") MultipartFile file) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            String text = resumeService.extractText(file);
            ResumeAnalysisDto parsed = resumeService.analyzeAndSave(text, principal.getName());
            return ResponseEntity.ok(parsed);
        } catch (IOException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to process PDF: " + e.getMessage()));
        }
    }
}
