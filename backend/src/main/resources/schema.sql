-- 1. Create Database if not exists
CREATE DATABASE IF NOT EXISTS ai_interview_db;
USE ai_interview_db;

-- 2. Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS candidate_answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS interviews;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS users;

-- 3. Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- CANDIDATE, RECRUITER, ADMIN
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Candidate Profiles Table (1-to-1 with Users)
CREATE TABLE profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    skills TEXT,
    experience_years INT DEFAULT 0,
    experience_level VARCHAR(50), -- ENTRY, MID, SENIOR
    target_domain VARCHAR(100),   -- Java, DSA, System Design, HR, etc.
    projects TEXT,
    role_fit_percentage INT,
    resume_url VARCHAR(255),
    resume_text LONGTEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Interview Sessions Table (Many-to-1 with Users)
CREATE TABLE interviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    domain VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL, -- EASY, MEDIUM, HARD
    status VARCHAR(50) NOT NULL,     -- IN_PROGRESS, COMPLETED, ABANDONED
    overall_score INT DEFAULT NULL,  -- Out of 100
    overall_feedback TEXT DEFAULT NULL,
    strengths TEXT DEFAULT NULL,
    weaknesses TEXT DEFAULT NULL,
    suggestions TEXT DEFAULT NULL,
    proctoring_violations INT DEFAULT 0, -- Count of tab switches / blur events
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Questions Table (Many-to-1 with Interviews)
CREATE TABLE questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    interview_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL, -- MCQ, SUBJECTIVE, CODING
    options TEXT,                      -- JSON string of options for MCQs
    correct_option VARCHAR(255),       -- Expected answer for MCQ comparison
    difficulty VARCHAR(50) NOT NULL,
    points INT DEFAULT 10,
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
);

-- 7. Candidate Answers Table (Many-to-1 with Interviews and Questions)
CREATE TABLE candidate_answers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    interview_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    submitted_answer TEXT,
    score INT DEFAULT 0,               -- AI evaluation score out of 100
    feedback TEXT,                     -- AI per-question feedback (strengths/weaknesses)
    time_taken_seconds INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_interview_question (interview_id, question_id)
);
