import { useState, useCallback } from 'react';

export default function useCurrencies(token) {
  const [currencies, setCurrencies] = useState([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(false);

  const fetchCurrencies = useCallback(async () => {
    setLoadingCurrencies(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/currency/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const result = await response.json();

      if (result.success && Array.isArray(result.currencies)) {
        setCurrencies(result.currencies);
      } else {
        setCurrencies([]);
        console.warn('Unexpected currency format:', result);
      }
    } catch (error) {
      console.error('Error fetching currencies:', error);
      setCurrencies([]);
    } finally {
      setLoadingCurrencies(false);
    }
  }, [token]);

  return { currencies, loadingCurrencies, fetchCurrencies };
}
