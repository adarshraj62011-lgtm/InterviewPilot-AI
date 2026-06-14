import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Play, 
  ArrowRight, 
  Brain, 
  Volume2, 
  Video, 
  CheckCircle2, 
  Users, 
  ArrowUpRight, 
  Check,
  TrendingUp,
  Cpu,
  Monitor
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="min-h-screen bg-[#fafbfe] text-slate-800 bg-grid-light relative overflow-x-hidden font-sans selection:bg-primary/20 selection:text-primary">
      
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] bg-gradient-to-bl from-accent-cyan/6 to-transparent rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[5%] w-[40%] h-[40%] bg-gradient-to-tr from-accent-violet/6 to-transparent rounded-full blur-[120px] pointer-events-none"></div>

      {/* Floating Header */}
      <header className="sticky top-4 z-50 max-w-6xl mx-auto px-4">
        <div className="glass-card-light rounded-2xl py-3 px-6 flex items-center justify-between border border-slate-200/50 shadow-sm">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent-cyan flex items-center justify-center shadow-sm">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
              INTERVIEWPILOT <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md tracking-wider">AI</span>
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#demo" className="hover:text-primary transition-colors">AI Engine</a>
          </nav>

          {/* CTA Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <Link 
                to="/dashboard" 
                className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:bg-primary-hover transition duration-200"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-primary transition-colors flex items-center gap-1.5">
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="px-4.5 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:bg-primary-hover transition duration-200"
                >
                  Start Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 max-w-4xl mx-auto text-center relative z-10">
        {/* Sparkles Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/8 border border-primary/15 text-primary mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Introducing Adaptive Multi-Sensor AI Coaching</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
          Master Placement Interviews <br className="hidden md:inline" />
          with <span className="bg-gradient-to-r from-primary via-accent-violet to-accent-cyan bg-clip-text text-transparent">Adaptive AI Coach</span>
        </h1>

        {/* Hero Description */}
        <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg mb-8 leading-relaxed">
          InterviewPilot AI conducts dynamic mock reviews, analyzing voice pacing, eye contact, and confidence levels in real time to secure top software engineering offers.
        </p>

        {/* Hero Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button 
            onClick={() => navigate(user ? '/interview' : '/register')}
            className="w-full sm:w-auto px-6 py-3.5 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary-hover hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>Start Free Mock Session</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <a 
            href="#demo"
            className="w-full sm:w-auto px-6 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Play className="w-4 h-4 text-primary fill-primary" />
            <span>See AI Demo</span>
          </a>
        </div>
      </section>

      {/* Dashboard Preview / Mockup Section */}
      <section id="demo" className="max-w-5xl mx-auto px-4 mb-28 relative z-10">
        <div className="bg-white/80 rounded-2xl border border-slate-200/60 shadow-xl overflow-hidden p-3 md:p-4 backdrop-blur-md">
          {/* Mock Window Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 px-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span className="w-3 h-3 rounded-full bg-green-400"></span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-100">
              BIOMETRIC_FEEDBACK_V1.BIN
            </div>
            <div className="w-12"></div>
          </div>

          {/* Mock Window Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#fafcff]">
            {/* Column 1: Face Tracker */}
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between h-56">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-slate-800">Face Recognition</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                  <span className="text-[10px] font-semibold text-green-500">LIVE</span>
                </div>
              </div>

              {/* Simulated Camera Feed */}
              <div className="bg-slate-50 border border-slate-100 rounded-lg flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Simulated Face Outline */}
                <div className="w-24 h-24 border border-dashed border-primary/40 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-20 h-20 border border-primary/20 rounded-full flex items-center justify-center">
                    <Brain className="w-8 h-8 text-primary/30" />
                  </div>
                </div>
                {/* Horizontal Scanline */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-bounce"></div>
                
                <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-slate-900/70 text-white px-1.5 py-0.5 rounded">
                  LOCKED: 92%
                </span>
              </div>
            </div>

            {/* Column 2: Speech Pattern */}
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col justify-between h-56">
              <div className="flex items-center gap-2 mb-3">
                <Volume2 className="w-4 h-4 text-accent-cyan" />
                <span className="text-xs font-bold text-slate-800">Speech Pattern</span>
              </div>

              {/* Speech Waveform Simulation */}
              <div className="flex-1 flex items-center justify-center gap-1 px-4">
                {[20, 40, 15, 60, 80, 50, 30, 75, 45, 90, 65, 40, 20, 55, 35, 70, 25].map((height, i) => (
                  <span 
                    key={i} 
                    className="w-1 bg-gradient-to-t from-primary to-accent-cyan rounded-full transition-all duration-300"
                    style={{ height: `${height}%` }}
                  ></span>
                ))}
              </div>

              <div className="text-center mt-3">
                <span className="text-[10px] font-extrabold text-primary bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-full">
                  132 WPM • Natural Pacing
                </span>
              </div>
            </div>

            {/* Column 3: AI Tips */}
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col justify-between h-56">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-4 h-4 text-accent-violet" />
                <span className="text-xs font-bold text-slate-800">AI Real-time Tips</span>
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex items-start gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800">Eye contact: Optimal</p>
                    <p className="text-[10px] text-slate-400">Maintaining proper camera alignment.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800">"Uh" used: 0 times</p>
                    <p className="text-[10px] text-slate-400">Filler word frequency is minimal.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800">Confidence: Rising</p>
                    <p className="text-[10px] text-slate-400">Pacing and gesture alignment verified.</p>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-primary to-accent-cyan h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Company Section */}
      <section className="text-center mb-28 max-w-4xl mx-auto px-4">
        <p className="text-xs font-extrabold text-slate-400 tracking-[0.2em] uppercase mb-4">
          Simulate Interviews At Top Tier Companies
        </p>
        <p className="text-sm font-semibold text-slate-500 mb-8">
          Practice with questions from companies you aspire to join
        </p>
        
        {/* Simple mock company logo elements */}
        <div className="flex flex-wrap items-center justify-center gap-12 grayscale opacity-50">
          <div className="flex items-center gap-2 font-bold text-lg text-slate-700">
            <span className="text-2xl text-blue-600 font-extrabold">G</span>oogle
          </div>
          <div className="flex items-center gap-2 font-bold text-lg text-slate-700">
            <span className="text-2xl text-orange-500 font-extrabold">A</span>mazon
          </div>
          <div className="flex items-center gap-2 font-bold text-lg text-slate-700">
            <span className="text-2xl text-blue-500 font-extrabold">M</span>icrosoft
          </div>
          <div className="flex items-center gap-2 font-bold text-lg text-slate-700">
            <span className="text-2xl text-red-600 font-extrabold">N</span>etflix
          </div>
          <div className="flex items-center gap-2 font-bold text-lg text-slate-700">
            <span className="text-2xl text-blue-700 font-extrabold">M</span>eta
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-24 bg-slate-50/50 border-y border-slate-100 relative">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              Multimodal AI Placement Training
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              Traditional interview platforms only save static answers. InterviewPilot AI observes facial biometrics and speech patterns to help you master your presence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md hover:border-slate-300/60 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Face & Gesture Tracker</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Utilize standard camera metrics to identify eye movement, posture shifts, and facial expressions representing high confidence levels.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md hover:border-slate-300/60 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 text-accent-cyan flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Speech Pattern Engine</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Track vocal pacing (words per minute), filler words frequency, and voice tone clarity. Receive concrete adjustments to sound professional.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md hover:border-slate-300/60 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-accent-violet/10 text-accent-violet flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Adaptive Follow-ups</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Experience dynamic interviews where the AI agent adjusts follow-up questions according to your previous responses, mirroring real panels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trial Space Section */}
      <section className="py-24 max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-2xl border border-slate-800 text-white overflow-hidden p-8 md:p-12 relative shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Subtle Glows */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="max-w-md relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider bg-white/10 border border-white/10 text-slate-300 uppercase mb-4">
              <Monitor className="w-3.5 h-3.5 text-primary" />
              Live Mock Simulation
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">
              Try Out the Interview Space
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Step directly into a fully simulated video workspace with an interactive AI interviewer. Test your mic, turn on your camera, and experience the complete dashboard immediately.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <span>Sign In to Start Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full md:w-1/2 relative">
            <div className="bg-slate-800/80 rounded-xl border border-slate-700/60 p-2 shadow-xl">
              <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center relative">
                {/* Simulated interview preview */}
                <div className="absolute inset-0 bg-cover bg-center opacity-60 bg-[url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600')]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-xs font-semibold text-white">AI Panelist: Dr. Sarah</span>
                </div>
                
                <div className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center cursor-pointer transition-colors relative z-10">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 text-center max-w-3xl mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Ready to ace your interviews?
        </h2>
        <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto">
          Join thousands of students preparing for their dream roles with real-time biometric tracking.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link 
            to="/register" 
            className="px-6 py-3.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl shadow-md transition duration-200"
          >
            Get Started Free
          </Link>
          <Link 
            to="/login" 
            className="px-6 py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-bold rounded-xl shadow-sm transition duration-200"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Brain className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-bold text-slate-900 tracking-tight">INTERVIEWPILOT AI</span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Adaptive virtual mock interviews powered by multimodal biometric tracking and natural language processing.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase mb-4">Features</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-500">
              <li><a href="#features" className="hover:text-primary transition-colors">Voice Analytics</a></li>
              <li><a href="#features" className="hover:text-primary transition-colors">Face Posture Scanner</a></li>
              <li><a href="#features" className="hover:text-primary transition-colors">Confidence Predictor</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase mb-4">Resources</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-500">
              <li><span className="text-slate-400">Documentation</span></li>
              <li><span className="text-slate-400">Privacy Policy</span></li>
              <li><span className="text-slate-400">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-slate-100/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-[11px]">
            &copy; 2026 InterviewPilot. Made for Students.
          </p>
          <div className="flex gap-4 text-[11px] font-semibold text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer">Security</span>
            <span className="hover:text-slate-600 cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
