import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, AlertCircle, Shield, Briefcase, GraduationCap, Brain } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('CANDIDATE'); // Default role
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(username, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Registration failed. Try a different username/email.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      id: 'CANDIDATE',
      title: 'Candidate',
      desc: 'Take mock interviews',
      icon: GraduationCap,
      color: 'from-primary to-accent-violet',
    },
    {
      id: 'RECRUITER',
      title: 'Recruiter',
      desc: 'Evaluate candidates',
      icon: Briefcase,
      color: 'from-accent-cyan to-accent-violet',
    },
    {
      id: 'ADMIN',
      title: 'Admin',
      desc: 'Manage configurations',
      icon: Shield,
      color: 'from-accent-rose to-accent-violet',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfe] text-slate-800 bg-grid-light relative flex items-center justify-center px-4 py-12 overflow-hidden font-sans">
      
      {/* Background glow effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-accent-cyan/8 to-transparent rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-lg bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-slate-200/60 relative z-10">
        
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
            Create Account
          </h1>
          <p className="text-slate-500 text-xs mt-1.5">Get started with AI-driven interview assessments</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs flex items-center gap-3 animate-shake">
            <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-wide text-slate-600">Choose Your Role</label>
            <div className="grid grid-cols-3 gap-3">
              {roleOptions.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = role === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setRole(opt.id)}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all duration-300 relative ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700'
                    }`}
                  >
                    <IconComponent className={`w-5.5 h-5.5 mb-1 ${isSelected ? 'text-primary' : 'text-slate-400'}`} />
                    <span className="text-xs">{opt.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold tracking-wide text-slate-600">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <User className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all duration-300 placeholder-slate-400 text-slate-800 text-sm focus:outline-none"
                placeholder="Choose username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold tracking-wide text-slate-600">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="w-4.5 h-4.5" />
              </span>
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all duration-300 placeholder-slate-400 text-slate-800 text-sm focus:outline-none"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wide text-slate-600">Password</label>
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

            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wide text-slate-600">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="w-4.5 h-4.5" />
                </span>
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all duration-300 placeholder-slate-400 text-slate-800 text-sm focus:outline-none"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
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
                <span>Sign Up</span>
                <UserPlus className="w-4.5 h-4.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500 font-semibold">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-hover transition duration-200">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
