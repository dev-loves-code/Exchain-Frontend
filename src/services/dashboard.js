
const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const fetchAdminDashboard = async (token) => {
  const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
};

export const fetchAgentDashboard = async (token) => {
  const res = await fetch(`${API_BASE_URL}/agent/dashboard`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
};

export const fetchUserDashboard = async (token) => {
  const res = await fetch(`${API_BASE_URL}/user/dashboard`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
};

export const fetchTransactions = async (token, filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE_URL}/transactions?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
};