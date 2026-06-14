package com.interview.ai.repository;

import com.interview.ai.entity.CandidateAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateAnswerRepository extends JpaRepository<CandidateAnswer, Long> {
    List<CandidateAnswer> findByInterviewId(Long interviewId);
    Optional<CandidateAnswer> findByInterviewIdAndQuestionId(Long interviewId, Long questionId);
}
