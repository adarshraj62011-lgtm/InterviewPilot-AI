import API from './api';

export const getHistory = async () => (await API.get('/dashboard/history')).data;
export const getScoreTrend = async () => (await API.get('/dashboard/score-trend')).data;
export const getTopicPerformance = async () => (await API.get('/dashboard/topics')).data;
export const compareCandidates = async () => (await API.get('/recruiter/candidates/compare')).data;

export const downloadReport = async (interviewId) => {
  const response = await API.get(`/dashboard/reports/${interviewId}.pdf`, { responseType: 'blob' });
  const url = URL.createObjectURL(response.data);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `interview-report-${interviewId}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
