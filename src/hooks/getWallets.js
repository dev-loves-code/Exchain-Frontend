import { useState, useEffect } from 'react';

export default function useWallets(token) {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWallets = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/wallets', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setWallets(result.data || []);
      } else {
        setWallets([]);
        console.warn(result.message);
      }
    } catch (error) {
      console.error('Error fetching wallets:', error);
      setWallets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  return {
    wallets,
    loading,
    fetchWallets,
  };
}