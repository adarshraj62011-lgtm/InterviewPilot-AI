import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ResumeUpload from './pages/ResumeUpload';
import Profile from './pages/Profile';
import InterviewSession from './pages/InterviewSession';
import Dashboard from './pages/Dashboard';
import FeedbackDetail from './pages/FeedbackDetail';
import PerformanceDashboard from './pages/PerformanceDashboard';
import RecruiterCompare from './pages/RecruiterCompare';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <InterviewSession />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-upload"
            element={
              <ProtectedRoute>
                <ResumeUpload />
              </ProtectedRoute>
            }
          />
          <Route path="/feedback/:id" element={<ProtectedRoute><FeedbackDetail /></ProtectedRoute>} />
          <Route path="/performance" element={<ProtectedRoute allowedRoles={['CANDIDATE']}><PerformanceDashboard /></ProtectedRoute>} />
          <Route path="/recruiter/compare" element={<ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}><RecruiterCompare /></ProtectedRoute>} />
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
