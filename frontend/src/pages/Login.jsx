import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, Brain, ArrowRight } from 'lucide-react';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(usernameOrEmail, password);
      navigate('/dashboard');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfe] text-slate-800 bg-grid-light relative flex items-center justify-center px-4 overflow-hidden font-sans">
      
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-accent-cyan/8 to-transparent rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-slate-200/60 relative z-10">
        
        {/* Logo at Top */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent-cyan flex items-center justify-center shadow-sm">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">
              INTERVIEWPILOT <span className="text-primary text-[10px] font-extrabold bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-md">AI</span>
            </span>
          </div>
          
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-xs mt-1.5">Sign in to your assessment portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs flex items-center gap-3 animate-shake">
            <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold tracking-wide text-slate-600">Username or Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all duration-300 placeholder-slate-400 text-slate-800 text-sm focus:outline-none"
                placeholder="Enter username or email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold tracking-wide text-slate-600">Password</label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="w-4.5 h-4.5" />
              </span>
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all duration-300 placeholder-slate-400 text-slate-800 text-sm focus:outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In</span>
                <LogIn className="w-4.5 h-4.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500 font-semibold">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary-hover transition duration-200">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
