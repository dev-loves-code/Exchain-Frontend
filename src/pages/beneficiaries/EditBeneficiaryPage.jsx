import React, { useEffect, useState } from 'react';
import BeneficiaryForm from '../../components/beneficiaries/BeneficiaryForm';
import Loading from '../../components/Loading.jsx';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditBeneficiaryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://127.0.0.1:8000/api';

  useEffect(() => {
    const fetchBeneficiary = async () => {
      try {
        setError('');
        const token = localStorage.getItem('token');
        if (!token) throw new Error('You must be logged in');

        const res = await fetch(`${API_BASE_URL}/beneficiaries/view/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          if (res.status === 404) throw new Error('Beneficiary not found.');
          throw new Error(errorData?.message || `HTTP error: ${res.status}`);
        }

        const data = await res.json();
        if (data.success) {
          setInitialData(data.beneficiary);
        } else {
          throw new Error(data.message || 'Failed to load beneficiary');
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Network error. Please check your backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchBeneficiary();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      if (!token) throw new Error('You must be logged in');

      const res = await fetch(`${API_BASE_URL}/beneficiaries/update/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        navigate('/beneficiaries');
      } else {
        throw new Error(data.message || 'Failed to update beneficiary');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Network error. Please check your backend.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {loading && (
          <Loading fullScreen={true} text="Loading beneficiary data..." />
        )}

        {error && !loading && (
          <div className="p-6 bg-red-100 text-red-700 rounded-3xl shadow-md mb-4">
            <p>{error}</p>
            <button
              onClick={() => navigate('/beneficiaries')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
            >
              Go Back to Beneficiaries List
            </button>
          </div>
        )}

        {!loading && initialData && !error && (
          <BeneficiaryForm
            mode="edit"
            initialData={initialData}
            onSuccess={handleSubmit}
          />
        )}

        {!loading && !initialData && !error && (
          <div className="p-6 bg-white rounded-3xl shadow-2xl text-center text-gray-700">
            Beneficiary data is empty or could not be loaded.
          </div>
        )}
      </div>
    </div>
  );
}
