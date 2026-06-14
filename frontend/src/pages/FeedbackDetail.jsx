import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import interviewService from '../services/interviewService';

const FeedbackDetail = () => {
  const { id } = useParams(); // interview id
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const data = await interviewService.getFeedback(id);
        setFeedback(data);
      } catch (err) {
        setError(err.message || 'Failed to load feedback');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="loader animate-spin border-4 border-primary border-t-transparent rounded-full w-12 h-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg text-red-400">
        <p>{error}</p>
        <Link to="/dashboard" className="ml-4 text-primary underline">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg p-6 md:p-12 relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto glass-card rounded-2xl p-8 border border-slate-700/40 relative z-10">
        <h1 className="text-3xl font-extrabold text-white mb-6 bg-gradient-to-r from-primary to-accent-cyan bg-clip-text text-transparent">
          Interview Feedback
        </h1>
        {feedback.length === 0 ? (
          <p className="text-slate-300">No feedback available.</p>
        ) : (
          <div className="space-y-6">
            {feedback.map((item) => (
              <div key={item.questionId} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
                <h2 className="text-lg font-semibold text-slate-100 mb-2">
                  Question {item.questionId}
                </h2>
                <p className="text-sm text-slate-300 mb-2"><strong>Prompt:</strong> {item.questionText}</p>
                <p className="text-sm text-slate-300 mb-2"><strong>Your Answer:</strong> {item.candidateAnswer || <em>None</em>}</p>
                <p className="text-sm text-slate-200"><strong>Score:</strong> {item.score}%</p>
                <p className="text-sm text-slate-200 mt-1"><strong>Feedback:</strong> {item.feedback}</p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 text-center">
          <Link to="/dashboard" className="px-6 py-3 bg-gradient-to-r from-primary to-accent-violet text-white font-bold rounded-xl shadow-neon-primary hover:scale-[1.02] transition">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetail;
