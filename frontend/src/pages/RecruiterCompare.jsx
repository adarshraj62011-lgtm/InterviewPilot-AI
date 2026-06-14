import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, Users } from 'lucide-react';
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
    <div className="min-h-screen bg-dark-bg p-6 md:p-10"><div className="max-w-7xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-7"><ArrowLeft className="w-4 h-4" /> Back to dashboard</Link>
      <div className="mb-8">
        <p className="text-primary font-bold uppercase tracking-widest text-xs">Recruiter Workspace</p>
        <h1 className="text-4xl font-extrabold text-white mt-2 flex items-center gap-3"><Users /> Candidate Comparison</h1>
        <p className="text-slate-400 mt-2">Compare resume fit, interview performance, and proctoring signals side by side.</p>
      </div>
      {error && <div className="mb-6 p-4 rounded-xl bg-accent-rose/10 text-accent-rose border border-accent-rose/30">{String(error)}</div>}
      {loading ? <p className="text-primary">Loading candidates...</p> : candidates.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400">No candidate data is available yet.</div>
      ) : (
        <div className="overflow-x-auto glass-card rounded-2xl border border-slate-700/40">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-slate-950/40 text-xs uppercase tracking-wider text-slate-500">
              <tr><th className="p-4">Rank / Candidate</th><th className="p-4">Target Domain</th><th className="p-4">Level</th><th className="p-4">Resume Fit</th><th className="p-4">Interviews</th><th className="p-4">Average</th><th className="p-4">Best</th><th className="p-4">Violations</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {candidates.map((candidate, index) => (
                <tr key={candidate.candidateId} className="text-slate-300 hover:bg-slate-900/30">
                  <td className="p-4 font-bold text-white"><span className="inline-flex w-7 h-7 items-center justify-center rounded-full bg-primary/15 text-primary mr-3">{index + 1}</span>{candidate.username}{index === 0 && <Award className="inline w-4 h-4 text-amber-400 ml-1" />}</td>
                  <td className="p-4">{candidate.targetDomain || 'Not analyzed'}</td><td className="p-4">{candidate.experienceLevel || '-'}</td>
                  <td className="p-4"><Score value={candidate.roleFitPercentage} /></td><td className="p-4">{candidate.completedInterviews}</td>
                  <td className="p-4"><Score value={candidate.averageScore} /></td><td className="p-4 font-bold text-accent-emerald">{candidate.bestScore}%</td>
                  <td className="p-4 text-accent-rose">{candidate.proctoringViolations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div></div>
  );
}

const Score = ({ value }) => <div className="w-28"><div className="flex justify-between text-xs mb-1"><span>{value}%</span></div><div className="h-2 rounded-full bg-slate-800 overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-accent-cyan" style={{ width: `${Math.min(100, value)}%` }} /></div></div>;
