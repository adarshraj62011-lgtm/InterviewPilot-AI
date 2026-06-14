import { useState } from 'react';
import { uploadResume } from '../services/resumeService';
import { Sparkles, AlertCircle, Upload } from 'lucide-react';

/**
 * A drag‑and‑drop UI for uploading a PDF resume. After a successful upload the
 * parsed data returned by the backend is displayed in a stylish glass‑card.
 *
 * The component is lightweight – it only handles UI concerns and delegates the
 * actual parsing to the backend via {@code uploadResume}. The backend calls the
 * {@code ResumeService} which extracts the text with PDFBox and runs AI analysis.
 */
export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setError('');
    setResult(null);
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const data = await uploadResume(file);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 glass-card rounded-2xl p-6 border border-slate-700/40 shadow-glass">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5 text-primary" /> Upload Resume
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-accent-rose/10 border border-accent-rose/30 rounded-xl text-accent-rose flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="bg-slate-900/60 text-slate-100 border border-slate-700/60 rounded-lg p-2"
        />
        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="px-4 py-2 bg-gradient-to-r from-primary to-accent-violet text-white rounded-lg hover:opacity-90 transition"
        >
          {loading ? 'Processing...' : 'Upload'}
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-slate-800/60 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Parsed Summary
            </h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-slate-300 mb-1">
                <strong>Role Fit</strong><span>{result.roleFitPercentage}%</span>
              </div>
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent-cyan" style={{ width: `${result.roleFitPercentage}%` }} />
              </div>
            </div>
            <p className="text-slate-300"><strong>Suggested Domain:</strong> {result.domainSuggestion}</p>
            <p className="text-slate-300"><strong>Years of Experience:</strong> {result.experienceYears}</p>
            <p className="text-slate-300"><strong>Experience Level:</strong> {result.experienceLevel}</p>
            <p className="text-slate-300"><strong>Key Skills:</strong> {result.skills?.join(', ') || 'None detected'}</p>
            <div className="text-slate-300 mt-3">
              <strong>Projects:</strong>
              {result.projects?.length ? (
                <ul className="list-disc ml-5 mt-1">{result.projects.map((project) => <li key={project}>{project}</li>)}</ul>
              ) : <span> None detected</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
