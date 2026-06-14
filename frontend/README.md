# InterviewPilot AI - Frontend Application

This folder contains the frontend codebase for the **InterviewPilot AI** system. The application is built using **React 19**, **Vite 8**, and **Tailwind CSS v4** to deliver a premium, responsive, and glassmorphic user interface.

For full system details, API routes, and backend setup instructions, please refer to the [Root README.md](../README.md).

---

## 🎨 Design System & Aesthetics
InterviewPilot AI features a sleek, premium, dark-themed user interface matching modern design standards:
- **Glassmorphic Cards**: Sleek translucent overlays with subtle borders (`glass-card`).
- **Glow Effects**: Radial ambient glows in the background.
- **Micro-Animations**: Hover actions, transitions, and button scale effects.
- **Responsive Layout**: Designed to work seamlessly across mobile, tablet, and desktop viewports.

---

## 🛠️ Main Frontend Technologies
- **Vite 8**: Development server and bundler.
- **React 19**: Component structure and logic.
- **Tailwind CSS v4**: Utility-first CSS styling and custom classes.
- **React Router DOM v7**: Seamless single-page routing and protection hooks.
- **Chart.js & React-Chartjs-2**: Renders score trends and topic-wise analytics.
- **Lucide React**: Clean, modern iconography.
- **Axios**: Promised-based HTTP client for API interactions.

---

## 📂 Directories & Pages

- `/src/pages/`:
  - **`Landing.jsx`**: Feature showcases, pricing tiers, and interactive FAQs.
  - **`Login.jsx` & `Register.jsx`**: User authorization forms.
  - **`Dashboard.jsx`**: Central command center showing profile metrics and quick actions.
  - **`Profile.jsx`**: Allows editing candidate skills, projects, and target domain.
  - **`ResumeUpload.jsx`**: Drag-and-drop resume upload page with instant parsing feedback.
  - **`InterviewSession.jsx`**: Dedicated evaluation interface. Renders MCQ, Subjective, and Coding questions with timers and proctoring.
  - **`FeedbackDetail.jsx`**: Question-by-question scoring and AI insights.
  - **`PerformanceDashboard.jsx`**: Beautiful visual charts mapping performance.
  - **`RecruiterCompare.jsx`**: Side-by-side dashboard for recruiters to compare scores.
- `/src/components/`:
  - **`ProtectedRoute.jsx`**: Restricts unauthorized page access based on roles.
- `/src/context/`:
  - **`AuthContext.jsx`**: Global authentication state and JWT token persistence.
- `/src/services/`:
  - **`api.js`**: Central Axios configurations with interceptors for attaching authorization headers.

---

## ⚙️ How to Run Locally

### Prerequisites
- Node.js (v18+)
- npm / yarn

### Steps
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web app at `http://localhost:5173`. Ensure your backend server is running on `http://localhost:8080` for API operations.

---

## ⏳ Frontend Roadmap (In Progress)
- [ ] **Rich Code Editor Integration**: Replacing plain textareas with Monaco Editor for coding questions.
- [ ] **Webcam Proctoring Module**: Integration of video overlay with real-time detection indicators.
- [ ] **Speech-to-Text Input**: Integrating a microphone button on subjective questions to support voice responses.
