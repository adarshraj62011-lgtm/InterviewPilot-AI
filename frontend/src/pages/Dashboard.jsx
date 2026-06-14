import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, GraduationCap, BarChart3, FileSearch, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-dark-bg p-6 md:p-12 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-slate-800/80 mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent-violet to-accent-cyan bg-clip-text text-transparent">
              Assessment Hub
            </h1>
            <p className="text-dark-muted mt-2">Welcome back, {user?.username} ({user?.role})</p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700/60 rounded-xl text-slate-200 hover:bg-slate-750 transition duration-300 font-semibold text-sm"
            >
              <UserIcon className="w-4 h-4" />
              <span>Profile Settings</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-accent-rose/10 border border-accent-rose/25 text-accent-rose rounded-xl hover:bg-accent-rose/20 transition duration-300 font-semibold text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Card */}
          <div className="glass-card md:col-span-2 p-8 rounded-2xl shadow-glass flex flex-col justify-between border border-slate-700/40">
            <div>
              <span className="text-xs font-bold text-primary tracking-widest uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                Mock Assessment
              </span>
              <h2 className="text-2xl font-bold text-white mt-4 mb-2">Prepare for your engineering placements</h2>
              <p className="text-dark-muted leading-relaxed">
                Take fully customized, AI-driven interviews covering Java, Data Structures, System Design, or Human Resources. Receive detailed grading rubrics, strengths analysis, and suggestions instantly.
              </p>
            </div>
            <div className="mt-8 flex gap-4">
              <Link to="/interview" className="px-6 py-3 bg-gradient-to-r from-primary to-accent-violet text-white font-bold rounded-xl shadow-neon-primary hover:scale-[1.02] transition-all duration-300 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                <span>Start Mock Interview</span>
              </Link>
              {user?.role !== 'CANDIDATE' && (
                <Link to="/recruiter/compare" className="px-6 py-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-all duration-300">
                  Compare Candidates
                </Link>
              )}
              {user?.role === 'CANDIDATE' && (
                <Link to="/performance" className="px-6 py-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-all duration-300 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance
                </Link>
              )}
            </div>
          </div>

          {/* Quick Profile/Stats Card */}
          <div className="glass-card p-8 rounded-2xl shadow-glass border border-slate-700/40 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-primary" />
                <span>Profile Snapshot</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-dark-muted text-sm">Target Domain</span>
                  <span className="text-slate-200 font-bold text-sm">Java Fullstack</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-dark-muted text-sm">Experience</span>
                  <span className="text-slate-200 font-bold text-sm">0 Years (Entry)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-dark-muted text-sm">Tests Completed</span>
                  <span className="text-accent-cyan font-bold text-sm">0 Sessions</span>
                </div>
              </div>
            </div>
            <Link
              to="/profile"
              className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center justify-center py-2 bg-slate-900/40 hover:bg-slate-900/80 rounded-xl border border-slate-700/40 mt-6 transition duration-200"
            >
              Update Full Profile
            </Link>
            {user?.role === 'CANDIDATE' && (
              <Link to="/resume-upload" className="text-sm font-semibold text-accent-cyan flex items-center justify-center gap-2 py-2 bg-slate-900/40 hover:bg-slate-900/80 rounded-xl border border-slate-700/40 mt-3">
                <FileSearch className="w-4 h-4" />
                Analyze Resume
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
