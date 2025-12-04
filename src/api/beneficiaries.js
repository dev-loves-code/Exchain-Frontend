const API_BASE_URL = 'http://127.0.0.1:8000/api/beneficiaries';

const getToken = () => localStorage.getItem('token');

export const beneficiariesAPI = {
  async list(search = '') {
    try {
      const url = search
        ? `${API_BASE_URL}?search=${encodeURIComponent(search)}`
        : API_BASE_URL;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return await res.json();
    } catch (error) {
      return { success: false, beneficiaries: [], error: error.message };
    }
  },

  async get(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/view/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return await res.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async create(data) {
    try {
      const res = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async update(id, data) {
    try {
      const res = await fetch(`${API_BASE_URL}/update/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async remove(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/destroy/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return await res.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
