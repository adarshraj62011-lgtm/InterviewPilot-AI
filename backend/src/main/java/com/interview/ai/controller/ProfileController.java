package com.interview.ai.controller;

import com.interview.ai.dto.ProfileResponse;
import com.interview.ai.dto.ProfileUpdateRequest;
import com.interview.ai.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        ProfileResponse profile = profileService.getProfileByUsername(principal.getName());
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(Principal principal, @RequestBody ProfileUpdateRequest updateRequest) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            ProfileResponse updated = profileService.updateProfile(principal.getName(), updateRequest);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
