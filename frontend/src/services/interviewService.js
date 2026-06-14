import API from './api';

const startInterview = async (domain, difficulty) => {
  const response = await API.post('/interviews/start', { domain, difficulty });
  return response.data;
};

const submitAnswer = async (interviewId, questionId, submittedAnswer, timeTakenSeconds) => {
  const response = await API.post(`/interviews/${interviewId}/answer`, {
    questionId,
    submittedAnswer,
    timeTakenSeconds,
  });
  return response.data;
};

const logViolation = async (interviewId) => {
  const response = await API.post(`/interviews/${interviewId}/violation`);
  return response.data;
};

const submitInterview = async (interviewId) => {
  const response = await API.post(`/interviews/${interviewId}/submit`);
  return response.data;
};

const getFeedback = async (interviewId) => {
  const response = await API.get(`/interviews/${interviewId}/feedback`);
  return response.data;
};

export default {
  startInterview,
  submitAnswer,
  logViolation,
  submitInterview,
  getFeedback,
};
