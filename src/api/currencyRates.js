import api from '../utils/api';

/**
 * Get all currency rates
 * @param {boolean} showOnlyAdmin - If true, only returns admin-created rates
 */
export const getCurrencyRates = async (showOnlyAdmin = false) => {
  try {
    const params = showOnlyAdmin ? { show_only_admin: 'true' } : {};
    const response = await api.get('/currency/admin/rates', { params });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch currency rates' };
  }
};

/**
 * Add a new currency rate
 * @param {Object} data - Currency rate data
 * @param {string} data.from_currency - Source currency code (e.g., 'USD')
 * @param {string} data.to_currency - Target currency code (e.g., 'EUR')
 * @param {number} data.exchange_rate - Exchange rate
 */
export const addCurrencyRate = async (data) => {
  try {
    const response = await api.post('/currency/admin/rates', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add currency rate' };
  }
};

/**
 * Update an existing currency rate
 * @param {number} id - Currency rate ID
 * @param {Object} data - Updated currency rate data
 * @param {number} data.exchange_rate - New exchange rate
 */
export const updateCurrencyRate = async (id, data) => {
  try {
    const response = await api.put(`/currency/admin/rates/${id}`, data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update currency rate' };
  }
};

/**
 * Delete a currency rate
 * @param {number} id - Currency rate ID
 */
export const deleteCurrencyRate = async (id) => {
  try {
    const response = await api.delete(`/currency/admin/rates/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete currency rate' };
  }
};
