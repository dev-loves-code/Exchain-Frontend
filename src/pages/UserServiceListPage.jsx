import React, { useEffect, useState } from 'react';
import { fetchServices } from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserServiceListPage = () => {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await fetchServices(token);
      setServices(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  return (
    <div className="p-6 md:p-12 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Available Services</h1>

      {loading ? (
        <p className="text-center mt-10">Loading...</p>
      ) : services.length === 0 ? (
        <p className="text-center mt-10">No services available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Speed</th>
                <th className="py-3 px-4 text-left">Fee %</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.service_id} className="border-b">
                  <td className="py-2 px-4">{s.service_type}</td>
                  <td className="py-2 px-4">{s.transfer_speed}</td>
                  <td className="py-2 px-4">{s.fee_percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserServiceListPage;