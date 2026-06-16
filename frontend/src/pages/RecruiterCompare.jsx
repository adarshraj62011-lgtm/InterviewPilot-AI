import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, Users, Sparkles, ShieldAlert, FileText } from 'lucide-react';
import { compareCandidates } from '../services/dashboardService';

export default function RecruiterCompare() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    compareCandidates()
      .then((data) => setCandidates([...data].sort((a, b) => b.averageScore - a.averageScore)))
      .catch((err) => setError(err.response?.data || 'Could not load candidates.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg p-6 md:p-10 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-5">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back to dashboard
          </Link>

          <div className="glass-card rounded-2xl border border-slate-700/40 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Recruiter Workspace
                </p>
                <h1 className="text-4xl font-extrabold text-white mt-2 flex items-center gap-3">
                  <Users className="text-primary" /> Candidate Comparison
                </h1>
                <p className="text-slate-400 mt-2 max-w-2xl">
                  Compare resume fit, interview performance, and proctoring signals side by side.
                </p>
              </div>

              <div className="flex gap-3">
                <Pill label="AI Scoring" value="Live" color="from-primary to-accent-violet" />
                <Pill label="Proctoring" value="Tracked" color="from-accent-cyan to-accent-emerald" icon={<ShieldAlert className="w-4 h-4" />} />
              </div>
            </div>
          </div>
        </div>

        {/* Feedback */}
        {error && (
          <div className="mt-6 mb-6 p-4 rounded-xl bg-accent-rose/10 text-accent-rose border border-accent-rose/30">
            {String(error)}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="mt-6 glass-card rounded-2xl border border-slate-700/40 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-primary font-bold">Loading candidates...</p>
              <div className="h-2 w-48 bg-slate-900/40 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full w-1/2 bg-gradient-to-r from-primary to-accent-cyan animate-pulse" />
              </div>
            </div>
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-slate-900/30 border border-slate-800/70 animate-pulse" />
              ))}
            </div>
          </div>
        ) : candidates.length === 0 ? (
          <div className="mt-6 glass-card rounded-2xl p-12 border border-slate-700/40 text-center">
            <div className="mx-auto w-fit p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <p className="text-white font-extrabold text-lg">No candidate data yet</p>
            <p className="text-slate-400 mt-2 text-sm">
              Upload resumes and run mock interviews first. The comparison table will appear here automatically.
            </p>
            <Link
              to="/dashboard"
              className="mt-6 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold hover:bg-primary/15 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto glass-card rounded-2xl border border-slate-700/40">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3">
              <div>
                <p className="text-slate-300 font-bold">Top Matches</p>
                <p className="text-slate-500 text-xs mt-1">
                  Sorted by <span className="text-primary font-bold">Average Score</span>
                </p>
              </div>
              <div className="text-xs text-slate-500">
                Tip: hover a row for a subtle lift.
              </div>
            </div>

            <table className="w-full text-left min-w-[900px]">
              <thead className="bg-slate-950/40 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-4">Rank / Candidate</th>
                  <th className="p-4">Target Domain</th>
                  <th className="p-4">Level</th>
                  <th className="p-4">Resume Fit</th>
                  <th className="p-4">Interviews</th>
                  <th className="p-4">Average</th>
                  <th className="p-4">Best</th>
                  <th className="p-4">Violations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {candidates.map((candidate, index) => (
                  <tr
                    key={candidate.candidateId}
                    className="text-slate-300 hover:bg-slate-900/30 transition transform hover:-translate-y-[1px]"
                  >
                    <td className="p-4 font-bold text-white">
                      <span
                        className={`inline-flex w-8 h-8 items-center justify-center rounded-full mr-3 border ${
                          index === 0
                            ? 'bg-amber-400/10 border-amber-400/30 text-amber-300'
                            : 'bg-primary/15 border-primary/20 text-primary'
                        }`}
                      >
                        {index + 1}
                      </span>
                      {candidate.username}
                      {index === 0 && <Award className="inline w-4 h-4 text-amber-400 ml-1" />}
                    </td>
                    <td className="p-4">{candidate.targetDomain || 'Not analyzed'}</td>
                    <td className="p-4">{candidate.experienceLevel || '-'}</td>
                    <td className="p-4">
                      <Score value={candidate.roleFitPercentage} />
                    </td>
                    <td className="p-4">{candidate.completedInterviews}</td>
                    <td className="p-4">
                      <Score value={candidate.averageScore} />
                    </td>
                    <td className="p-4 font-bold text-accent-emerald">{candidate.bestScore}%</td>
                    <td className="p-4 text-accent-rose font-bold">{candidate.proctoringViolations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const Pill = ({ label, value, color, icon }) => (
  <div className="glass-card rounded-xl border border-slate-700/40 px-4 py-3">
    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
      {icon ? icon : null}
      {label}
    </p>
    <p className={`text-sm font-extrabold mt-1 bg-gradient-to-r ${color || 'from-primary to-accent-cyan'} bg-clip-text text-transparent`}>
      {value}
    </p>
  </div>
);

const Score = ({ value }) => {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="w-28">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-200">{safeValue}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-900/50 overflow-hidden border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent-cyan"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
};

