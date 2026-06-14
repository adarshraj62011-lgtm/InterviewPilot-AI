package com.interview.ai.service;

import com.interview.ai.dto.ProfileResponse;
import com.interview.ai.dto.ProfileUpdateRequest;
import com.interview.ai.entity.Profile;
import com.interview.ai.entity.Role;
import com.interview.ai.entity.User;
import com.interview.ai.repository.ProfileRepository;
import com.interview.ai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Transactional(readOnly = true)
    public ProfileResponse getProfileByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: User not found with username: " + username));

        ProfileResponse.ProfileResponseBuilder builder = ProfileResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name());

        if (user.getRole() == Role.CANDIDATE) {
            Profile profile = profileRepository.findByUserId(user.getId())
                    .orElseGet(() -> {
                        // Safe fallback in case profile was not initialized on register
                        Profile newProfile = Profile.builder().user(user).experienceYears(0).build();
                        return profileRepository.save(newProfile);
                    });
            
            builder.id(profile.getId())
                   .skills(profile.getSkills())
                   .experienceYears(profile.getExperienceYears())
                   .experienceLevel(profile.getExperienceLevel())
                   .targetDomain(profile.getTargetDomain())
                   .resumeUrl(profile.getResumeUrl());
        }

        return builder.build();
    }

    @Transactional
    public ProfileResponse updateProfile(String username, ProfileUpdateRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: User not found with username: " + username));

        if (user.getRole() != Role.CANDIDATE) {
            throw new RuntimeException("Error: Profiles can only be updated for Candidates.");
        }

        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseGet(() -> Profile.builder().user(user).build());

        if (request.getSkills() != null) {
            profile.setSkills(request.getSkills());
        }
        if (request.getExperienceYears() != null) {
            profile.setExperienceYears(request.getExperienceYears());
        }
        if (request.getExperienceLevel() != null) {
            profile.setExperienceLevel(request.getExperienceLevel());
        }
        if (request.getTargetDomain() != null) {
            profile.setTargetDomain(request.getTargetDomain());
        }

        Profile updatedProfile = profileRepository.save(profile);

        return ProfileResponse.builder()
                .id(updatedProfile.getId())
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .skills(updatedProfile.getSkills())
                .experienceYears(updatedProfile.getExperienceYears())
                .experienceLevel(updatedProfile.getExperienceLevel())
                .targetDomain(updatedProfile.getTargetDomain())
                .resumeUrl(updatedProfile.getResumeUrl())
                .build();
    }
}
