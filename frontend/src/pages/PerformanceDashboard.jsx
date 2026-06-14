import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Tooltip, Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { ArrowLeft, Download, FileText, TrendingUp } from 'lucide-react';
import { downloadReport, getHistory, getScoreTrend, getTopicPerformance } from '../services/dashboardService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(148,163,184,.08)' } },
    y: { min: 0, max: 100, ticks: { color: '#94A3B8' }, grid: { color: 'rgba(148,163,184,.08)' } },
  },
  plugins: { legend: { labels: { color: '#E2E8F0' } } },
};

export default function PerformanceDashboard() {
  const [history, setHistory] = useState([]);
  const [trend, setTrend] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    Promise.all([getHistory(), getScoreTrend(), getTopicPerformance()])
      .then(([historyData, trendData, topicData]) => {
        setHistory(historyData);
        setTrend(trendData);
        setTopics(topicData);
      })
      .catch((err) => setError(err.response?.data || 'Could not load performance data.'))
      .finally(() => setLoading(false));
  }, []);

  const average = useMemo(() => {
    const completed = history.filter((item) => item.completedAt);
    return completed.length
      ? Math.round(completed.reduce((sum, item) => sum + item.totalScore, 0) / completed.length)
      : 0;
  }, [history]);

  const trendData = {
    labels: trend.map((item) => new Date(`${item.date}T00:00:00`).toLocaleDateString()),
    datasets: [{
      label: 'Interview score',
      data: trend.map((item) => item.score),
      borderColor: '#6366F1',
      backgroundColor: 'rgba(99,102,241,.25)',
      tension: 0.35,
      fill: true,
    }],
  };
  const topicData = {
    labels: topics.map((item) => item.topic),
    datasets: [{
      label: 'Average score',
      data: topics.map((item) => item.averageScore),
      backgroundColor: ['#6366F1', '#22D3EE', '#A78BFA', '#34D399', '#FB7185'],
      borderRadius: 8,
    }],
  };

  const handleDownload = async (id) => {
    setDownloading(id);
    try {
      await downloadReport(id);
    } catch (err) {
      setError(err.response?.data || 'Report download failed.');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) return <div className="min-h-screen bg-dark-bg grid place-items-center text-primary">Loading analytics...</div>;

  return (
    <div className="min-h-screen bg-dark-bg p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-7">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-primary font-bold uppercase tracking-widest text-xs">Candidate Analytics</p>
            <h1 className="text-4xl font-extrabold text-white mt-2">Performance Dashboard</h1>
          </div>
          <div className="flex gap-3"><Stat label="Completed" value={trend.length} /><Stat label="Average" value={`${average}%`} /></div>
        </div>
        {error && <div className="mb-6 p-4 rounded-xl bg-accent-rose/10 text-accent-rose border border-accent-rose/30">{String(error)}</div>}

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Score Trend" icon={<TrendingUp className="w-5 h-5 text-primary" />}>
            {trend.length ? <Line options={chartOptions} data={trendData} /> : <Empty text="Complete an interview to see your trend." />}
          </ChartCard>
          <ChartCard title="Topic Performance" icon={<FileText className="w-5 h-5 text-accent-cyan" />}>
            {topics.length ? <Bar options={chartOptions} data={topicData} /> : <Empty text="No topic performance is available yet." />}
          </ChartCard>
        </div>

        <section className="glass-card rounded-2xl border border-slate-700/40 overflow-hidden">
          <div className="p-6 border-b border-slate-800"><h2 className="text-xl font-bold text-white">Interview History</h2></div>
          {history.length === 0 ? <Empty text="Your interview history will appear here." /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[760px]">
                <thead className="text-xs uppercase tracking-wider text-slate-500 bg-slate-950/30">
                  <tr><th className="p-4">Date</th><th className="p-4">Domain</th><th className="p-4">Difficulty</th><th className="p-4">Status</th><th className="p-4">Score</th><th className="p-4">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {history.map((item) => (
                    <tr key={item.id} className="text-slate-300 hover:bg-slate-900/30">
                      <td className="p-4">{new Date(item.startedAt).toLocaleDateString()}</td>
                      <td className="p-4 font-semibold text-white">{item.domain}</td>
                      <td className="p-4">{item.difficulty}</td>
                      <td className="p-4">{item.completedAt ? 'COMPLETED' : 'IN PROGRESS'}</td>
                      <td className="p-4 font-bold text-accent-emerald">{item.completedAt ? `${item.totalScore}%` : '-'}</td>
                      <td className="p-4 flex gap-2">
                        {item.completedAt && <>
                          <Link to={`/feedback/${item.id}`} className="px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20">Feedback</Link>
                          <button onClick={() => handleDownload(item.id)} disabled={downloading === item.id}
                            className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 inline-flex items-center gap-2">
                            <Download className="w-4 h-4" /> {downloading === item.id ? 'Preparing...' : 'PDF'}
                          </button>
                        </>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const Stat = ({ label, value }) => <div className="glass-card rounded-xl px-5 py-3 border border-slate-700/40"><p className="text-xs text-slate-500 uppercase">{label}</p><p className="text-xl font-bold text-white">{value}</p></div>;
const ChartCard = ({ title, icon, children }) => <section className="glass-card rounded-2xl p-6 border border-slate-700/40"><h2 className="text-lg font-bold text-white flex items-center gap-2 mb-5">{icon}{title}</h2><div className="h-72">{children}</div></section>;
const Empty = ({ text }) => <div className="h-full min-h-40 grid place-items-center text-slate-500 p-8 text-center">{text}</div>;
