import React, { useEffect, useState } from 'react';
import { fetchAgents } from '../services/api';

export const AdminAgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const getAgents = async () => {
      try {
        const response = await fetchAgents(token);
        console.log('Agents API response:', response);

        // Make sure to get the array safely
        const agentsArray = response.data || [];
        setAgents(agentsArray);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getAgents();
  }, []);

  if (loading) return <p className="text-center mt-20 text-black">Loading agents...</p>;

  if (agents.length === 0) return <p className="text-center mt-20 text-black">No agents found.</p>;

  return (
    <div className="p-6 md:p-12 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-black">Agents</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow overflow-hidden text-black">
          <thead className="bg-gray-200 text-black">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Business Name</th>
              <th className="py-3 px-4 text-left">License</th>
              <th className="py-3 px-4 text-left">City</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-left">Working Hours</th>
              <th className="py-3 px-4 text-left">Commission Rate (%)</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Total Commission ($)</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.agent_id} className="border-b text-black">
                <td className="py-2 px-4">{agent.agent_id}</td>
                <td className="py-2 px-4">{agent.full_name}</td>
                <td className="py-2 px-4">{agent.email}</td>
                <td className="py-2 px-4">{agent.phone}</td>
                <td className="py-2 px-4">{agent.business_name || 'N/A'}</td>
                <td className="py-2 px-4">{agent.business_license || 'N/A'}</td>
                <td className="py-2 px-4">{agent.city || 'N/A'}</td>
                <td className="py-2 px-4">{agent.address || 'N/A'}</td>
                <td className="py-2 px-4">
                  {agent.working_hours_start && agent.working_hours_end
                    ? `${agent.working_hours_start} - ${agent.working_hours_end}`
                    : 'N/A'}
                </td>
                <td className="py-2 px-4">{agent.commission_rate ?? 'N/A'}</td>
                <td className="py-2 px-4">{agent.status}</td>
                <td className="py-2 px-4">{agent.total_commission}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};