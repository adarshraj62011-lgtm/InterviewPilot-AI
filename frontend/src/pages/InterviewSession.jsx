import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import interviewService from '../services/interviewService';
import { 
  Play, Timer, AlertTriangle, ChevronRight, Save, 
  Send, Code, HelpCircle, CheckCircle, ShieldAlert, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

const InterviewSession = () => {
  const { user } = useAuth();
  const [domain, setDomain] = useState('Java');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Session states
  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: submittedAnswer }
  const [savedAnswers, setSavedAnswers] = useState({}); // { questionId: { score, feedback } }
  const [inSession, setInSession] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Timers
  const [overallTime, setOverallTime] = useState(900); // 15 mins default
  const [questionTime, setQuestionTime] = useState(120); // per-question countdown
  
  // Proctoring
  const [violations, setViolations] = useState(0);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const violationLoggedRef = useRef(false);

  // Refs for tracking time spent per question
  const timeSpentRef = useRef({}); // { questionId: seconds }
  const timerIntervalRef = useRef(null);

  // Setup blur/tab-switch proctoring listeners
  useEffect(() => {
    if (!inSession || completed) return;

    const handleFocusLoss = async () => {
      if (violationLoggedRef.current) return;
      violationLoggedRef.current = true;
      
      setViolations(prev => {
        const next = prev + 1;
        // Call backend API to log violation
        if (interview) {
          interviewService.logViolation(interview.id).catch(console.error);
        }
        return next;
      });
      setShowViolationWarning(true);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleFocusLoss();
      }
    };

    window.addEventListener('blur', handleFocusLoss);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleFocusLoss);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [inSession, completed, interview]);

  // Main countdown timer execution
  useEffect(() => {
    if (!inSession || completed) return;

    timerIntervalRef.current = setInterval(() => {
      // 1. Overall Session Time
      setOverallTime(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });

      // 2. Question Time
      setQuestionTime(prev => {
        if (prev <= 1) {
          // Question timer expired! Auto-save draft and go to next
          handleSaveAndNext(true);
          return 120; // fallback reset, will be overwritten by resetQuestionTimer
        }
        return prev - 1;
      });

      // 3. Increment current question time spent
      const currentQId = questions[currentIdx]?.id;
      if (currentQId) {
        timeSpentRef.current[currentQId] = (timeSpentRef.current[currentQId] || 0) + 1;
      }

    }, 1000);

    return () => clearInterval(timerIntervalRef.current);
  }, [inSession, completed, currentIdx, questions]);

  // Reset question timer based on type
  useEffect(() => {
    if (!inSession || questions.length === 0) return;
    
    const currentQ = questions[currentIdx];
    if (currentQ.questionType === 'MCQ') {
      setQuestionTime(60); // 1 minute for MCQ
    } else if (currentQ.questionType === 'CODING') {
      setQuestionTime(300); // 5 minutes for Coding
    } else {
      setQuestionTime(120); // 2 minutes for Subjective
    }
  }, [currentIdx, inSession, questions]);

  const handleStart = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCompleted(false);
    setViolations(0);
    setAnswers({});
    setSavedAnswers({});
    timeSpentRef.current = {};
    
    try {
      const data = await interviewService.startInterview(domain, difficulty);
      setInterview(data);
      setQuestions(data.questions || []);
      setOverallTime(900); // reset overall timer
      setInSession(true);
      setCurrentIdx(0);
    } catch (err) {
      alert('Failed to generate questions. Ensure backend is running and AI key/mock schema is valid.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndNext = async (isAuto = false) => {
    const currentQ = questions[currentIdx];
    const answerText = answers[currentQ.id] || '';
    const timeSpent = timeSpentRef.current[currentQ.id] || 0;

    // Reset current question timer
    timeSpentRef.current[currentQ.id] = 0;

    try {
      // Save answer endpoint returns immediate score & feedback
      const saved = await interviewService.submitAnswer(interview.id, currentQ.id, answerText, timeSpent);
      setSavedAnswers(prev => ({
        ...prev,
        [currentQ.id]: { score: saved.score, feedback: saved.feedback }
      }));
    } catch (err) {
      console.error('Failed to save answer:', err);
    }

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else if (isAuto) {
      // Auto-submit if time runs out on the last question
      handleAutoSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    if (!window.confirm('Are you sure you want to end the interview? Candidates will receive immediate feedback.')) {
      return;
    }
    await executeSubmission();
  };

  const handleAutoSubmit = async () => {
    alert('Time has expired! Submitting your answers automatically.');
    await executeSubmission();
  };

  const executeSubmission = async () => {
    setSubmitting(true);
    clearInterval(timerIntervalRef.current);
    try {
      const data = await interviewService.submitInterview(interview.id);
      setInterview(data);
      setInSession(false);
      setCompleted(true);
    } catch (err) {
      alert('Error submitting interview. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Main UI components
  if (completed && interview) {
    return (
      <div className="min-h-screen bg-dark-bg p-6 md:p-12 relative overflow-hidden flex items-center justify-center">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-emerald/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-3xl glass-card rounded-2xl p-8 border border-slate-700/40 shadow-glass relative z-10">
          <div className="text-center mb-8 border-b border-slate-800 pb-6">
            <div className="inline-flex p-3 bg-accent-emerald/10 rounded-full mb-3 border border-accent-emerald/20">
              <CheckCircle className="w-12 h-12 text-accent-emerald" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-accent-emerald to-accent-cyan bg-clip-text text-transparent">
              Interview Completed
            </h1>
            <p className="text-dark-muted mt-2">Assessment scorecard successfully processed</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-xs font-bold text-dark-muted uppercase tracking-wider block mb-1">Score Card</span>
              <span className="text-3xl font-extrabold text-white flex justify-center items-center gap-1">
                <Award className="w-6 h-6 text-primary" />
                {interview.overallScore}%
              </span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-xs font-bold text-dark-muted uppercase tracking-wider block mb-1">Difficulty</span>
              <span className="text-lg font-bold text-slate-200 block mt-1">{interview.difficulty}</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-xs font-bold text-dark-muted uppercase tracking-wider block mb-1">Proctor Warnings</span>
              <span className={`text-lg font-bold block mt-1 ${interview.proctoringViolations > 2 ? 'text-accent-rose' : 'text-slate-200'}`}>
                {interview.proctoringViolations}
              </span>
            </div>
          </div>

          {/* AI Comprehensive Feedback */}
          <div className="space-y-6">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
              <h3 className="text-sm font-bold text-primary tracking-wide uppercase mb-2">AI Summary Feedback</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{interview.overallFeedback}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-accent-emerald/5 border border-accent-emerald/20 rounded-xl p-5">
                <h3 className="text-sm font-bold text-accent-emerald tracking-wide uppercase mb-2">Technical Strengths</h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{interview.strengths}</p>
              </div>
              <div className="bg-accent-rose/5 border border-accent-rose/20 rounded-xl p-5">
                <h3 className="text-sm font-bold text-accent-rose tracking-wide uppercase mb-2">Development Areas</h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{interview.weaknesses}</p>
              </div>
            </div>

            <div className="bg-accent-violet/5 border border-accent-violet/20 rounded-xl p-5">
              <h3 className="text-sm font-bold text-accent-violet tracking-wide uppercase mb-2">Suggestions for Improvement</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{interview.suggestions}</p>
            </div>
          </div>

          <div className="mt-8 flex justify-center border-t border-slate-800 pt-6">
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-primary to-accent-violet text-white font-bold rounded-xl shadow-neon-primary hover:scale-[1.02] transition"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (inSession && questions.length > 0) {
    const currentQ = questions[currentIdx];
    const isLastQ = currentIdx === questions.length - 1;
    const currentQAnswer = answers[currentQ.id] || '';

    // Options mapping if MCQ
    const mcqOptions = currentQ.options || [];

    return (
      <div className="min-h-screen bg-dark-bg p-4 md:p-8 relative overflow-hidden flex flex-col justify-between">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Proctoring warning modal */}
        {showViolationWarning && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-dark-card border border-accent-rose/40 max-w-md w-full rounded-2xl p-6 shadow-neon-primary text-center">
              <div className="inline-flex p-3 bg-accent-rose/10 rounded-full border border-accent-rose/20 text-accent-rose mb-4 animate-bounce">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Proctoring Warning</h3>
              <p className="text-dark-muted text-sm mb-6 leading-relaxed">
                Focus loss or tab change detected! We have registered this action. Please maintain your active browser focus to avoid disqualification.
              </p>
              <div className="bg-slate-900/40 py-2 px-4 rounded-xl border border-slate-850 text-slate-300 text-sm font-semibold mb-6">
                Active Violations: <span className="text-accent-rose font-bold">{violations}</span>
              </div>
              <button
                onClick={() => {
                  setShowViolationWarning(false);
                  violationLoggedRef.current = false;
                }}
                className="w-full py-3 bg-gradient-to-r from-accent-rose to-accent-rose/85 text-white font-bold rounded-xl hover:opacity-95 transition"
              >
                I Understand, Continue Assessment
              </button>
            </div>
          </div>
        )}

        {/* Main session board */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow items-stretch relative z-10">
          {/* Question panel checklist (Left sidebar) */}
          <div className="glass-card rounded-2xl p-5 flex flex-col justify-between border border-slate-700/40">
            <div>
              <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-slate-100">Question Board</h3>
              </div>
              <div className="space-y-3">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentIdx;
                  const isSaved = savedAnswers[q.id] !== undefined;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition duration-200 text-left ${
                        isCurrent 
                          ? 'border-primary bg-primary/10 text-white font-semibold'
                          : 'border-slate-800 bg-slate-900/30 text-dark-muted hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isSaved ? 'bg-accent-emerald' : 'bg-slate-500'}`}></span>
                        <span className="text-xs">Question {idx + 1}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-800 rounded border border-slate-700">
                        {q.questionType}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 border-t border-slate-800 pt-4 space-y-3 text-xs text-dark-muted">
              <div className="flex justify-between">
                <span>Violations logged:</span>
                <span className={violations > 2 ? 'text-accent-rose font-bold' : 'text-slate-400'}>{violations}</span>
              </div>
              <div className="flex justify-between">
                <span>Assessed difficulty:</span>
                <span className="text-slate-200">{difficulty}</span>
              </div>
            </div>
          </div>

          {/* Question console (Central workboard) */}
          <div className="lg:col-span-3 flex flex-col justify-between glass-card rounded-2xl p-6 md:p-8 border border-slate-700/40 relative">
            {/* Console Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6 flex-wrap gap-4">
              <div>
                <span className="text-xs font-bold text-primary tracking-widest uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span className="text-xs font-semibold text-dark-muted ml-3 uppercase">
                  {currentQ.questionType} Question • {currentQ.points} Points
                </span>
              </div>

              {/* Glowing Timers */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl">
                  <Timer className="w-4 h-4 text-accent-cyan animate-pulse" />
                  <span className="text-xs font-bold text-accent-cyan">Question: {formatTime(questionTime)}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl">
                  <Timer className="w-4 h-4 text-accent-violet" />
                  <span className="text-xs font-bold text-accent-violet">Session: {formatTime(overallTime)}</span>
                </div>
              </div>
            </div>

            {/* Question Text */}
            <div className="mb-6 flex-grow">
              <h2 className="text-xl font-bold text-slate-100 mb-6 leading-relaxed">
                {currentQ.questionText}
              </h2>

              {/* Dynamic Inputs by Question Type */}
              {currentQ.questionType === 'MCQ' && (
                <div className="grid grid-cols-1 gap-4 mt-6">
                  {mcqOptions.map((opt, oIdx) => {
                    const isSelected = currentQAnswer === opt;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => setAnswers({ ...answers, [currentQ.id]: opt })}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 relative ${
                          isSelected
                            ? 'border-primary bg-primary/15 text-slate-100 shadow-neon-primary'
                            : 'border-slate-800 bg-slate-900/20 text-slate-300 hover:border-slate-750 hover:bg-slate-900/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                            isSelected ? 'bg-primary border-primary text-white' : 'border-slate-700 text-slate-500'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="text-sm font-semibold">{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQ.questionType === 'SUBJECTIVE' && (
                <div className="mt-4 space-y-2">
                  <label className="text-xs font-bold text-dark-muted uppercase tracking-wider">Type your detailed explanation below</label>
                  <textarea
                    className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-100 focus:outline-none h-64 font-sans leading-relaxed"
                    placeholder="Enter your answer explaining key concepts..."
                    value={currentQAnswer}
                    onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
                  />
                  <div className="text-right text-[10px] text-dark-muted">
                    Word count: {currentQAnswer ? currentQAnswer.trim().split(/\s+/).length : 0} words
                  </div>
                </div>
              )}

              {currentQ.questionType === 'CODING' && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-dark-muted uppercase tracking-wider flex items-center gap-2">
                      <Code className="w-4 h-4 text-primary" />
                      <span>Coding Terminal (Java)</span>
                    </label>
                  </div>
                  <textarea
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/25 text-emerald-400 focus:outline-none h-80 font-mono text-sm leading-relaxed"
                    placeholder="// Write your Java code challenge implementation here...&#10;public class Solution {&#10;    // Write your code&#10;}"
                    value={currentQAnswer}
                    onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
                  />
                </div>
              )}
            </div>

            {/* Console Footer Actions */}
            <div className="flex justify-between items-center border-t border-slate-800 pt-6 mt-6 flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="px-4 py-2 border border-slate-800 rounded-xl text-slate-400 hover:border-slate-700 hover:text-white transition duration-200 disabled:opacity-30 disabled:pointer-events-none text-sm font-semibold"
              >
                Previous
              </button>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleSaveAndNext(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 rounded-xl font-bold text-sm flex items-center gap-2 transition"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Draft</span>
                </button>

                {isLastQ ? (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={submitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-accent-cyan to-primary hover:opacity-90 text-white font-extrabold rounded-xl shadow-neon-cyan flex items-center gap-2 transition"
                  >
                    <span>Finish Interview</span>
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSaveAndNext(false)}
                    className="px-5 py-2.5 bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover hover:to-accent-violet/90 text-white font-bold rounded-xl shadow-neon-primary flex items-center gap-2 transition"
                  >
                    <span>Save & Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pre-session assessment config layout
  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-12 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-cyan/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-lg glass-card rounded-2xl p-8 shadow-glass relative z-10 border border-slate-700/50">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-primary/10 rounded-xl mb-3 border border-primary/20 animate-neon-pulse">
            <Play className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent-cyan bg-clip-text text-transparent">
            Start Mock Interview
          </h1>
          <p className="text-dark-muted mt-2">Set assessment difficulty and domain category</p>
        </div>

        <form onSubmit={handleStart} className="space-y-6">
          {/* Target Domain */}
          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-wide text-slate-300">Choose Domain Category</label>
            <select
              className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-100 focus:outline-none"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            >
              <option value="Java">Java Full Stack</option>
              <option value="DSA">Data Structures & Algorithms</option>
              <option value="System Design">System Design</option>
              <option value="HR">Human Resources (HR)</option>
            </select>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-wide text-slate-300">Difficulty Grade</label>
            <select
              className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-100 focus:outline-none"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex gap-3 text-xs text-slate-300">
            <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="leading-relaxed">
              **Proctoring Alert**: Switching browser tabs or clicking outside the window boundary is tracked and triggers violation logs. Ensure you remain in full focus during the 15-minute slot.
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover hover:to-accent-violet/90 text-white font-extrabold rounded-xl shadow-neon-primary hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Launch Interview Session</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <Link to="/dashboard" className="text-dark-muted hover:text-white transition duration-200">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
