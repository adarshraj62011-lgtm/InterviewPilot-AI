package com.interview.ai.repository;

import com.interview.ai.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByCandidateIdOrderByCreatedAtDesc(Long candidateId);
    List<Interview> findByCandidateIdAndStatusOrderByCreatedAtAsc(Long candidateId, String status);
    List<Interview> findByStatusOrderByCreatedAtDesc(String status);
}
