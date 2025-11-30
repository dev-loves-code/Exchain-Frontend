// src/services/api.js
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Helper function for API calls
const apiFetch = async (url, token, options = {}) => {
  if (!token) throw new Error('No token provided');
  
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  
  const res = await fetch(url, config);
  
  // Check if response is JSON
  const contentType = res.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  let result;
  if (isJson) {
    result = await res.json();
  } else {
    const text = await res.text();
    // If it's HTML, it's probably an error page
    if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
      throw new Error('Server error: Received HTML response instead of JSON');
    }
    throw new Error(`Unexpected response format: ${text.substring(0, 100)}`);
  }
  
  if (!res.ok) {
    throw new Error(result.message || `HTTP error! status: ${res.status}`);
  }
  
  if (result.success === false) {
    throw new Error(result.message || 'Operation failed');
  }
  
  return result.data;
};

export const fetchServices = async (token, filters = {}, page = 1, perPage = 10, sort = '') => {
  // Build params object
  const params = {
    page,
    perPage, 
    sort
  };
  
  // Add filters in Spatie format
  if (filters.service_type) {
    params['filter[service_type]'] = filters.service_type;
  }
  if (filters.transfer_speed) {
    params['filter[transfer_speed]'] = filters.transfer_speed;
  }
  
  const queryString = new URLSearchParams(params).toString();
  return apiFetch(`${API_BASE_URL}/services?${queryString}`, token);
};
export const fetchService = async (token, id) => {
  return apiFetch(`${API_BASE_URL}/services/${id}`, token);
};

export const createService = async (token, serviceData) => {
  return apiFetch(`${API_BASE_URL}/services`, token, {
    method: 'POST',
    body: JSON.stringify(serviceData),
  });
};

export const updateService = async (token, id, serviceData) => {
  return apiFetch(`${API_BASE_URL}/services/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(serviceData),
  });
};

export const deleteService = async (token, id) => {
  if (!token) throw new Error('No token provided');
  
  const config = {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  
  const res = await fetch(`${API_BASE_URL}/services/${id}`, config);
  
  if (res.status === 204) {
    return { success: true, message: 'Service deleted successfully' };
  }
  
  const contentType = res.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  let result;
  if (isJson) {
    result = await res.json();
  } else {
    const text = await res.text();
    if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
      throw new Error('Server error: Received HTML response instead of JSON');
    }
    if (res.ok) {
      return { success: true, message: 'Service deleted successfully' };
    }
    throw new Error(`Unexpected response format: ${text.substring(0, 100)}`);
  }
  
  if (!res.ok) {
    throw new Error(result.message || `HTTP error! status: ${res.status}`);
  }
  
  return result;
};

export const fetchAdminDashboard = async (token) => {
if (!token) throw new Error('No token provided');
const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
headers: { Authorization: `Bearer ${token}` },
});
return res.json();
};

export const fetchAgentDashboard = async (token) => {
if (!token) throw new Error('No token provided');
const res = await fetch(`${API_BASE_URL}/agent/dashboard`, {
headers: { Authorization: `Bearer ${token}` },
});
return res.json();
};

export const fetchUserDashboard = async (token) => {
if (!token) throw new Error('No token provided');
const res = await fetch(`${API_BASE_URL}/user/dashboard`, {
headers: { Authorization: `Bearer ${token}` },
});
return res.json();
};

// --- Agents ---
export const fetchAgents = async (token) => {
const res = await fetch(`${API_BASE_URL}/admin/agents`, {
headers: { Authorization: `Bearer ${token}` },
});
return res.json();
};

// --- Transactions ---
export const fetchTransactions = async (token, filters = {}) => {
if (!token) throw new Error('No token provided');
const params = new URLSearchParams(filters).toString();
const res = await fetch(`${API_BASE_URL}/transactions?${params}`, {
headers: { Authorization: `Bearer ${token}` },
});
return res.json();
};
export const fetchReviews = async (token, filters = {}, page = 1, perPage = 10, sort = 'created_at') => {
    const queryParams = new URLSearchParams({
        page,
        perPage,
        sort,
        ...filters
    }).toString();

    console.log('🔍 Making request to:', `http://127.0.0.1:8000/api/reviews?${queryParams}`);

    const response = await fetch(`http://127.0.0.1:8000/api/reviews?${queryParams}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📦 Raw API response structure:', {
        hasSuccess: data.success,
        hasData: !!data.data,
        dataIsObject: typeof data.data === 'object',
        dataHasData: data.data && Array.isArray(data.data.data),
        dataKeys: data.data ? Object.keys(data.data) : 'no data'
    });
    
    return data;
};
export const fetchReview = async (token, id) => {
    const response = await fetch(`http://127.0.0.1:8000/api/reviews/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch review: ${response.statusText}`);
    }

    return await response.json();
};

export const createReview = async (token, reviewData) => {
    const response = await fetch('http://127.0.0.1:8000/api/reviews', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Failed to create review');
    }

    return data;
};

export const updateReview = async (token, id, reviewData) => {
    const response = await fetch(`http://127.0.0.1:8000/api/reviews/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Failed to update review');
    }

    return data;
};

export const deleteReview = async (token, id) => {
    const response = await fetch(`http://127.0.0.1:8000/api/reviews/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete review');
    }

    return { success: true };
};