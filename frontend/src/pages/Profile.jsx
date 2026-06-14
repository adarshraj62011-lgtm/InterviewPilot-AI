import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { ArrowLeft, Save, AlertCircle, Sparkles, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [experienceLevel, setExperienceLevel] = useState('ENTRY');
  const [targetDomain, setTargetDomain] = useState('Java');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get('/profile');
        const data = response.data;
        if (data) {
          setSkills(data.skills || '');
          setExperienceYears(data.experienceYears || 0);
          setExperienceLevel(data.experienceLevel || 'ENTRY');
          setTargetDomain(data.targetDomain || 'Java');
        }
      } catch (err) {
        setError('Failed to load profile. Ensure backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);

    try {
      await API.put('/profile', {
        skills,
        experienceYears: parseInt(experienceYears),
        experienceLevel,
        targetDomain,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg text-primary">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg p-6 md:p-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-dark-muted hover:text-white transition duration-205 mb-8 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="glass-card rounded-2xl p-8 border border-slate-700/40 shadow-glass">
          <div className="flex items-center gap-4 border-b border-slate-800 pb-6 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile Setup</h1>
              <p className="text-dark-muted mt-1">Configure your mock interview parameters</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-accent-rose/10 border border-accent-rose/30 rounded-xl text-accent-rose text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-accent-emerald/10 border border-accent-emerald/30 rounded-xl text-accent-emerald text-sm flex items-center gap-3">
              <Sparkles className="w-5 h-5 flex-shrink-0" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Target Domain */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Target Interview Domain</label>
                <select
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-100 focus:outline-none"
                  value={targetDomain}
                  onChange={(e) => setTargetDomain(e.target.value)}
                >
                  <option value="Java">Java Full Stack</option>
                  <option value="DSA">Data Structures & Algorithms</option>
                  <option value="System Design">System Design</option>
                  <option value="HR">Human Resources (HR)</option>
                </select>
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Experience Level</label>
                <select
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-100 focus:outline-none"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <option value="ENTRY">Entry Level (College Grad)</option>
                  <option value="MID">Mid Level (1-4 Years)</option>
                  <option value="SENIOR">Senior Level (5+ Years)</option>
                </select>
              </div>
            </div>

            {/* Experience Years */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Years of Experience</label>
              <input
                type="number"
                min="0"
                max="50"
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-100 focus:outline-none"
                placeholder="e.g. 2"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Technical Skills (Comma separated)</label>
              <textarea
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-100 focus:outline-none h-32"
                placeholder="Java, Spring Boot, React, MySQL, Docker..."
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover hover:to-accent-violet/90 text-white font-semibold rounded-xl shadow-neon-primary hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
