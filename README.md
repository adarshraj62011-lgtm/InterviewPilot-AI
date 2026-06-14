# InterviewPilot AI - Mock Interview & Candidate Assessment System

InterviewPilot AI is a state-of-the-art, AI-powered platform designed to automate and enhance technical mock interviews and candidate assessments. The platform allows candidates to upload resumes, get automated profile suggestions, take full-length mock interviews (containing MCQs, Subjective, and Coding questions), and view comprehensive dashboards mapping their performance over time. It also features a Recruiter Panel to compare candidate metrics side-by-side.

---

## 🚀 Key Features (Done So Far)

### 👥 1. Secure Authentication & User Roles
- **JWT-Based Authentication**: Secure registration and login flow using JSON Web Tokens.
- **Role-Based Access Control**:
  - **`CANDIDATE`**: Can customize profiles, upload resumes, start mock interviews, track score trends, and download interview reports.
  - **`RECRUITER`** & **`ADMIN`**: Access to candidate comparisons and assessment reports.

### 📄 2. AI-Powered Resume Parser
- **PDF Extraction**: Extracts raw text from uploaded PDF resumes using **Apache PDFBox**.
- **AI Profile Mapping**: Leverages OpenAI (GPT-4o) or Gemini (1.5 Flash) APIs to extract:
  - Technical Skills & Domain Suggestions (Backend, Frontend, DevOps, Data Science, Mobile).
  - Experience level (`ENTRY`, `MID`, `SENIOR`) and years of experience.
  - Projects summary and Role Fit Percentage.
- **Offline Parser Fallback**: A robust regex-based heuristic mapping logic that evaluates profile data locally if AI API keys are unavailable.

### 🧠 3. Interactive AI Mock Interview Sessions
- **Question Generation**: Dynamically creates exactly 5 tailored questions (2 MCQs, 2 Subjective, 1 Coding) matching the selected domain and difficulty level.
- **Real-Time AI Grading**: Evaluates subjective and coding answers on-the-fly, returning scores (out of 100) and actionable technical feedback.
- **Full Proctoring System**: Tracks and increments browser tab switches and window focus-out events to flag potential cheating/malpractices.
- **End-of-Session Summaries**: Generates an overall evaluation featuring strengths, weaknesses, and concrete preparation suggestions.

### 📊 4. Candidate & Recruiter Dashboards
- **Visual Analytics**: Interactive line charts for score trends and bar charts for topic-wise average scores built with **React Chart.js**.
- **Detailed Feedback View**: Question-by-question response details, correct answers, candidate answers, and AI feedback.
- **PDF Report Download**: Compiles a professional, multi-page PDF report containing candidates' performance details and grading using **PDFBox** on the backend.
- **Recruiter Comparison Matrix**: Side-by-side candidate comparison metrics (best score, average score, role fit, proctoring violations) for recruiters to assess performance.

---

## 🛠️ Technology Stack

### Backend
- **Core Framework**: Spring Boot 3.3.0 (Java 21)
- **Security**: Spring Security + JSON Web Token (JJWT)
- **Database**: H2 In-Memory Database (configured with MySQL compatibility)
- **ORM**: Spring Data JPA / Hibernate
- **AI Integrations**: OpenAI REST API (GPT-4o) & Google Gemini REST API (Gemini-1.5-Flash)
- **PDF Processing**: Apache PDFBox 3.0.2

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Vanilla CSS custom components
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Data Visualization**: Chart.js + React-Chartjs-2
- **Icons**: Lucide React

---

## 📂 Project Structure

```text
Aiinterview/
├── backend/
│   ├── src/main/java/com/interview/ai/
│   │   ├── config/             # App & Security Configurations
│   │   ├── controller/         # API Endpoint Controllers
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── entity/             # JPA Database Entities
│   │   ├── repository/         # Database Repositories
│   │   ├── security/           # JWT & UserDetails Services
│   │   └── service/            # Core business logic (AI, Resume, Dashboard)
│   └── pom.xml                 # Backend Maven Dependencies
│
├── frontend/
│   ├── src/
│   │   ├── assets/             # Images & Logos
│   │   ├── components/         # Reusable UI Components (ProtectedRoute, etc.)
│   │   ├── context/            # AuthContext for Global State
│   │   ├── pages/              # App Screens (Landing, Interview, Dashboard, Recruiter)
│   │   ├── services/           # Axios API Client
│   │   ├── App.jsx             # React App Routing Configuration
│   │   ├── index.css           # Global CSS and Tailwind Imports
│   │   └── main.jsx            # Frontend entry point
│   ├── package.json            # Frontend NPM Dependencies
│   └── vite.config.js          # Vite configuration
```

---

## 🔌 API Documentation Summary

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/auth/register` | `POST` | Public | Register a new user |
| `/api/auth/login` | `POST` | Public | Authenticate user & receive JWT token |
| `/api/resume/upload` | `POST` | Candidate | Upload and analyze PDF resume |
| `/api/interviews/start` | `POST` | Candidate | Generate questions and start a session |
| `/api/interviews/{id}/answer` | `POST` | Candidate | Submit answer for a specific question |
| `/api/interviews/{id}/violation` | `POST` | Candidate | Log a proctoring tab-switch event |
| `/api/interviews/{id}/submit` | `POST` | Candidate | Submit full interview and trigger overall evaluation |
| `/api/interviews/{id}/feedback` | `GET` | Candidate | Get detailed feedback for all answers |
| `/api/interviews/{id}/analytics` | `GET` | Candidate | Get analytical metrics for the session |
| `/api/dashboard/history` | `GET` | Candidate | Retrieve completed interview history |
| `/api/dashboard/score-trend` | `GET` | Candidate | Retrieve score progression data |
| `/api/dashboard/topics` | `GET` | Candidate | Retrieve average scores by domain |
| `/api/dashboard/reports/{id}.pdf`| `GET` | Owner/Recruiter| Download PDF interview report |
| `/api/recruiter/candidates/compare`| `GET` | Recruiter/Admin| Compare performance across candidates |

---

## 🛠️ Installation & Setup

### Prerequisites
- **Java JDK 21**
- **Node.js** (v18 or higher) & **npm**
- **Maven** 3.8+

### Step 1: Configure Environment Keys
Open `backend/src/main/resources/application.properties` and configure your API keys (or pass them as env variables):
```properties
app.openai.api-key=YOUR_OPENAI_API_KEY
app.gemini.api-key=YOUR_GEMINI_API_KEY
app.ai.preferred-provider=openai # Choose 'openai' or 'gemini'
```

### Step 2: Start Backend Server
```bash
cd backend
mvn clean spring-boot:run
```
The backend server runs on `http://localhost:8080`.
The H2 Database console is available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:ai_interview_db`, Username: `sa`, Password: `[blank]`).

### Step 3: Start Frontend Server
```bash
cd frontend
npm install
npm run dev
```
The frontend application runs on `http://localhost:5173`.

---

## ⏳ Features in Progress / Future Roadmap

- [ ] **Voice-Based Mock Interviews**: Implement web audio API to record candidate answers and transcribe them using speech-to-text (e.g., OpenAI Whisper).
- [ ] **Interactive In-Browser Code Runner**: Integrate an editor like Monaco Editor and connect it to a sandbox compiler API to run and validate candidate code against custom test cases.
- [ ] **AI-Powered Webcam Proctoring**: Use face detection APIs (e.g., Face-api.js) to detect multiple faces, absence of the user, or gaze redirection.
- [ ] **Custom Assessment Builder for Recruiters**: Allow recruiters to set up their own custom question pools, specify strict time-limits, and configure domain criteria.
- [ ] **Production-Grade Database & Deployment**: Migrating H2 database to PostgreSQL/MySQL and containerizing the application using Docker and Kubernetes.
