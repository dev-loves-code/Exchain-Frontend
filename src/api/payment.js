import axios from './axios';

export const rechargeWallet = (user_id, amount, payment_method_token) => {
  return axios.post('/payments/recharge-wallet', {
    user_id,
    amount,
    payment_method_token,
  });
};

export const getWalletBalance = (user_id) => {
  return axios.get(`/payments/wallet-balance`, {
    params: { user_id },
  });
};

export const getPaymentMethods = () => {
  return axios.get('/payments/payment-methods');
};

export const transferToBank = (user_id, amount, bank_account_id) => {
  return axios.post('/payments/wallet-to-bank', {
    user_id,
    amount,
    bank_account_id,
  });
};
