import api from '../utils/api';

export const getWalletBalance = async () => {
  try {
    const response = await api.get('/payments/wallet-balance');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch wallet balance' };
  }
};

export const getPaymentMethods = async () => {
  try {
    const response = await api.get('/payments/payment-methods');
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: 'Failed to fetch payment methods' }
    );
  }
};

export const rechargeWallet = async (data) => {
  try {
    const response = await api.post('/payments/recharge-wallet', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to recharge wallet' };
  }
};

export const transferToBank = async (data) => {
  try {
    const response = await api.post('/payments/wallet-to-bank', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to transfer to bank' };
  }
};

export const getBankAccounts = async () => {
  try {
    const response = await api.get('/beneficiaries');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch bank accounts' };
  }
};
