// src/components/DashboardsShared.jsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { fetchAdminDashboard, fetchAgentDashboard, fetchUserDashboard } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
/* ---------------- Shared UI components ---------------- */
export const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

export const SummaryGrid = ({ items }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
    {items.map((it, idx) => (
      <StatCard key={idx} title={it.title} value={it.value} />
    ))}
  </div>
);

export const LineChart = ({ labels = [], data = [], label = 'Data' }) => {
    if (!data || data.length === 0) return null;
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        fill: true,
        tension: 0.3,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <Line data={chartData} />
    </div>
  );
};

export const TransactionsTable = ({ transactions = [], showAgent = false }) => (
  <div className="overflow-x-auto bg-white p-4 rounded-xl shadow">
    <table className="w-full text-left table-auto border-collapse">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-black">ID</th>
          {showAgent && <th className="px-4 py-2 text-black">Agent</th>}
          <th className="px-4 py-2 text-black">Amount</th>
          <th className="px-4 py-2 text-black">Status</th>
          <th className="px-4 py-2 text-black">Date</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length === 0 ? (
          <tr>
            <td colSpan={showAgent ? 5 : 4} className="text-center py-6 text-black">
              No transactions found
            </td>
          </tr>
        ) : (
          transactions.map(t => (
            <tr key={t.transaction_id} className="border-b hover:bg-gray-50 transition">
              <td className="px-4 py-2 text-black">{t.transaction_id}</td>
              {showAgent && <td className="px-4 py-2 text-black">{t.agent?.full_name || 'N/A'}</td>}
              <td className="px-4 py-2 text-black">${t.transfer_amount}</td>
              <td className="px-4 py-2 font-semibold text-black">{t.status}</td>
              <td className="px-4 py-2 text-black">{new Date(t.created_at).toLocaleString()}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

/* ---------------- Admin Dashboard ---------------- */
export const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const fetchData = async () => {
      try {
        const data = await fetchAdminDashboard(token);
        setDashboard(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  if (!dashboard) return <p className="text-center mt-20">Loading...</p>;

  const usersPerDay = (dashboard.history?.users_per_day || []).map(d => ({
    date: d.date,
    total: d.total,
  }));

  return (
    <div className="p-6 md:p-12 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome Admin</h1>

      {/* Summary Grid - 4 per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
       {[
  { title: 'Total Transactions', value: dashboard.summary.total_transactions ?? 0 },
  { title: 'Total Volume', value: `$${dashboard.summary.total_volume ?? 0}` },
  { title: 'Total Fees', value: `$${dashboard.summary.total_fees ?? 0}` },
  { title: 'Total Users', value: dashboard.summary.total_users ?? 0 },
  { title: 'Total Agents', value: dashboard.summary.total_agents ?? 0 },
  { title: 'Done Transactions', value: dashboard.summary.transactions_by_status?.done ?? 0 },
  { title: 'Total Agent Commission', value: `$${dashboard.summary.total_agent_commission ?? 0}` },
  {
    title: 'Agents',
    value: 'View Agents',
    onClick: () => navigate('/admin/agents'), 
    isButton: true
  }
].map((item, idx) => (
  <div
    key={idx}
    className={`bg-white p-4 rounded-xl shadow text-center ${
      item.isButton ? 'cursor-pointer hover:bg-gray-100' : ''
    }`}
    onClick={item.isButton ? item.onClick : undefined} // attach onClick
  >
    <p className="text-sm text-gray-500">{item.title}</p>
    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
  </div>
))}
      </div>

      {/* Transactions Table */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-black">Transactions (History)</h2>
        <TransactionsTable transactions={dashboard.history.latest_transactions || []} showAgent />
      </div>

     {/* Users Growth Graph */}
{usersPerDay.length > 0 && (
  <div className="mb-6">
    <h2 className="text-2xl font-semibold mb-4 text-black">Users Growth</h2>
    <LineChart
      labels={usersPerDay.map(d => d.date)}
      data={usersPerDay.map(d => d.total)}
      label="New users"
    />
  </div>
)}

{dashboard.history?.fees_per_day?.length > 0 && (
  <div className="mb-6">
    <h2 className="text-2xl font-semibold mb-4 text-black">Fees Collected Over Time</h2>
    <LineChart
      labels={dashboard.history.fees_per_day.map(d => d.date)}
      data={dashboard.history.fees_per_day.map(d => d.total)}
      label="Fees ($)"
    />
  </div>
)}
    </div>
  );
};

/* ---------------- Agent Dashboard ---------------- */
export const AgentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchData = async () => {
      try {
        const data = await fetchAgentDashboard(token);
        setDashboard(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (!dashboard) return <p className="text-center mt-20">Loading...</p>;

  const usersPerDay = Object.entries(dashboard.history.users_per_day || {}).map(
    ([date, total]) => ({ date, total })
  );

  return (
    <div className="p-6 md:p-12 min-h-screen bg-gray-50 text-black">
      <h1 className="text-4xl font-bold mb-6">Agent Dashboard</h1>

      <SummaryGrid
        items={[
          { title: 'Total Transactions', value: dashboard.summary.total_transactions ?? 0 },
          { title: 'Pending', value: dashboard.summary.pending ?? 0 },
          { title: 'Done', value: dashboard.summary.done ?? 0 },
          { title: 'Total Processed', value: `$${dashboard.summary.total_transfer_amount ?? 0}` },
          { title: 'Unique Users', value: dashboard.summary.unique_users ?? 0 },
          { title: 'Current Commission Rate', value: `${dashboard.summary.commission_rate ?? 0}%` },
          { title: 'Total Commission Earned', value: `$${dashboard.summary.total_commission_earned ?? 0}` },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        {/* Cash Pickups Table */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-black">Latest Cash Pickups</h2>
          <TransactionsTable 
            transactions={dashboard.history.latest_transactions || []} 
            textColor="black"
          />
        </div>

        {/* Cash Operations Table */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-black">Latest Cash Operations</h2>
          <table className="min-w-full border border-black">
            <thead className="bg-white text-black">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Operation Type</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Agent Commission (%)</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.history.latest_cash_operations?.map(op => (
                <tr key={op.cash_op_id} className="text-black">
                  <td className="px-4 py-2 border">{op.cash_op_id}</td>
                  <td className="px-4 py-2 border">{op.operation_type}</td>
                  <td className="px-4 py-2 border">${op.amount}</td>
                  <td className="px-4 py-2 border">{op.agent_commission}%</td>
                  <td className="px-4 py-2 border">{op.status}</td>
                  <td className="px-4 py-2 border">{new Date(op.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-black">Users Over Time</h2>
        <LineChart
          labels={usersPerDay.map(d => d.date)}
          data={usersPerDay.map(d => d.total)}
          label="Unique users per day"
        />
      </div>
    </div>
  );
};
/* ---------------- User Dashboard (simplified) ---------------- */
export const UserDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const fetchData = async () => {
      try {
        const data = await fetchUserDashboard(token);
        setDashboard(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  if (!dashboard) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="p-6 md:p-12 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome,</h1>

      <SummaryGrid
        items={[
          { title: 'Total Transactions', value: dashboard.total_transactions ?? 0 },
          { title: 'Pending', value: dashboard.pending ?? 0 },
          { title: 'Done', value: dashboard.done ?? 0 },
          { title: 'Total Sent', value: `$${dashboard.total_sent_amount ?? 0}` },
        ]}
      />

      <div>
        <h2 className="text-2xl font-semibold mb-4">Latest Transactions</h2>
        <TransactionsTable transactions={dashboard.latest_transactions || []} />
      </div>
    </div>
  );
};