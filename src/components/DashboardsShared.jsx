// src/components/DashboardsShared.jsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { 
  Users, DollarSign, CreditCard, TrendingUp, 
  BarChart3, Wallet, Clock, CheckCircle,
  UserPlus, Percent, Sparkles, ArrowRight
} from 'lucide-react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

import { fetchAdminDashboard, fetchAgentDashboard, fetchUserDashboard } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

/* ---------------- Shared UI components ---------------- */
export const StatCard = ({ title, value, icon: Icon, onClick, isButton = false }) => (
  <div
    className={`bg-white p-6 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl ${
      isButton ? 'cursor-pointer hover:-translate-y-1' : ''
    }`}
    onClick={isButton ? onClick : undefined}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
        {Icon && <Icon className="w-6 h-6 text-blue-600" />}
      </div>
      {isButton && <ArrowRight className="w-5 h-5 text-gray-400" />}
    </div>
    <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
    <p className="text-2xl font-black text-gray-900">{value}</p>
  </div>
);

export const SummaryGrid = ({ items }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
    {items.map((it, idx) => (
      <StatCard 
        key={idx} 
        title={it.title} 
        value={it.value} 
        icon={it.icon}
        onClick={it.onClick}
        isButton={it.isButton}
      />
    ))}
  </div>
);

export const LineChart = ({ labels = [], data = [], label = 'Data', gradientColor = '99, 102, 241' }) => {
  if (!data || data.length === 0 || !labels || labels.length === 0) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-2xl flex items-center justify-center h-64">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No chart data available</p>
        </div>
      </div>
    );
  }
  
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        fill: true,
        tension: 0.4,
        borderColor: `rgb(${gradientColor})`,
        backgroundColor: `rgba(${gradientColor}, 0.1)`,
        borderWidth: 3,
        pointBackgroundColor: `rgb(${gradientColor})`,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#6b7280',
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#6b7280',
        }
      }
    },
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-2xl h-72">
      <Line data={chartData} options={options} />
    </div>
  );
};

export const TransactionsTable = ({ transactions = [], showAgent = false }) => (
  <div className="bg-white rounded-3xl shadow-2xl p-6">
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200">ID</th>
            {showAgent && <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200">Agent</th>}
            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200">Amount</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200">Status</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={showAgent ? 5 : 4} className="text-center py-12">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No transactions found</p>
                </div>
              </td>
            </tr>
          ) : (
            transactions.map(t => (
              <tr key={t.transaction_id} className="hover:bg-gray-50 transition-all duration-200">
                <td className="px-4 py-3 text-gray-900 font-medium border-r border-gray-100">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-bold text-sm">#{t.transaction_id}</span>
                    </div>
                  </div>
                </td>
                {showAgent && (
                  <td className="px-4 py-3 text-gray-700 border-r border-gray-100">
                    {t.user?.full_name || 'N/A'}
                  </td>
                )}
                <td className="px-4 py-3 text-gray-900 font-semibold border-r border-gray-100">
                  ${t.transfer_amount}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                    t.status === 'done' ? 'bg-green-100 text-green-800 border border-green-200' :
                    t.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                    'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 text-sm">
                  {new Date(t.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
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

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const usersPerDay = (dashboard.history?.users_per_day || []).map(d => ({
    date: d.date,
    total: d.total,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-screen-2xl mx-auto"> {/* Changed to wider max-width */}
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span className="text-blue-600 font-semibold text-lg">Administrator Dashboard</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">
            Welcome, Administrator
          </h1>
          <p className="text-slate-500 mt-2">
            Overview of platform performance and metrics
          </p>
        </div>

        {/* Main Content Card */}
        <div className="w-full bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8">
          {/* Summary Grid */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Overview</h2>
            <SummaryGrid
              items={[
                { 
                  title: 'Total Transactions', 
                  value: dashboard.summary.total_transactions ?? 0, 
                  icon: CreditCard 
                },
                { 
                  title: 'Total Volume', 
                  value: `$${dashboard.summary.total_volume ?? 0}`, 
                  icon: DollarSign 
                },
                { 
                  title: 'Total Fees', 
                  value: `$${dashboard.summary.total_fees ?? 0}`, 
                  icon: TrendingUp 
                },
                { 
                  title: 'Total Users', 
                  value: dashboard.summary.total_users ?? 0, 
                  icon: Users 
                },
                { 
                  title: 'Total Agents', 
                  value: dashboard.summary.total_agents ?? 0, 
                  icon: Users 
                },
                { 
                  title: 'Completed Transactions', 
                  value: dashboard.summary.transactions_by_status?.done ?? 0, 
                  icon: CheckCircle 
                },
                { 
                  title: 'Agent Commissions', 
                  value: `$${dashboard.summary.total_agent_commission ?? 0}`, 
                  icon: Percent 
                },
                { 
                  title: 'Manage Agents', 
                  value: 'View Agents', 
                  icon: UserPlus,
                  onClick: () => navigate('/agents'), 
                  isButton: true 
                }
              ]}
            />
          </div>

          {/* Recent Transactions - REMOVED showAgent prop */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Transactions</h2>
            <TransactionsTable transactions={dashboard.history.latest_transactions || []} />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Users Growth Chart */}
            {usersPerDay.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Users Growth</h2>
                <LineChart
                  labels={usersPerDay.map(d => d.date)}
                  data={usersPerDay.map(d => d.total)}
                  label="New Users"
                  gradientColor="59, 130, 246"
                />
              </div>
            )}

            {/* Fees Chart */}
            {dashboard.history?.fees_per_day?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Fees Collected</h2>
                <LineChart
                  labels={dashboard.history.fees_per_day.map(d => d.date)}
                  data={dashboard.history.fees_per_day.map(d => d.total)}
                  label="Fees ($)"
                  gradientColor="16, 185, 129"
                />
              </div>
            )}
          </div>

          {/* Footer Note */}
          <p className="text-xs text-slate-500 text-center mt-8 pt-6 border-t border-gray-100">
            Data updates in real-time. Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
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

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agent dashboard...</p>
        </div>
      </div>
    );
  }

  // Fix for agent graph data structure
  const usersPerDay = Array.isArray(dashboard.history?.users_per_day) 
    ? dashboard.history.users_per_day.map(d => ({ date: d.date, total: d.total }))
    : dashboard.history?.users_per_day 
      ? Object.entries(dashboard.history.users_per_day).map(([date, total]) => ({ date, total }))
      : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-screen-2xl mx-auto"> {/* Changed to wider max-width */}
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span className="text-blue-600 font-semibold text-lg">Agent Dashboard</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">
            Welcome, Agent
          </h1>
          <p className="text-slate-500 mt-2">
            Manage your transactions and monitor performance
          </p>
        </div>

        {/* Main Content Card */}
        <div className="w-full bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8">
          {/* Summary Grid */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Overview</h2>
            <SummaryGrid
              items={[
                { 
                  title: 'Total Transactions', 
                  value: dashboard.summary.total_transactions ?? 0, 
                  icon: CreditCard 
                },
                { 
                  title: 'Pending', 
                  value: dashboard.summary.pending ?? 0, 
                  icon: Clock 
                },
                { 
                  title: 'Completed', 
                  value: dashboard.summary.done ?? 0, 
                  icon: CheckCircle 
                },
                { 
                  title: 'Total Processed', 
                  value: `$${dashboard.summary.total_transfer_amount ?? 0}`, 
                  icon: DollarSign 
                },
                { 
                  title: 'Unique Users', 
                  value: dashboard.summary.unique_users ?? 0, 
                  icon: Users 
                },
                { 
                  title: 'Commission Rate', 
                  value: `${dashboard.summary.commission_rate ?? 0}%`, 
                  icon: Percent 
                },
                { 
                  title: 'Commission Earned', 
                  value: `$${dashboard.summary.total_commission_earned ?? 0}`, 
                  icon: Wallet 
                },
              ]}
            />
          </div>

          {/* Recent Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Cash Pickups Table */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Transactions</h2>
              <TransactionsTable 
                transactions={dashboard.history.latest_transactions || []} 
              />
            </div>

            {/* Cash Operations Table */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Cash Operations</h2>
              <div className="bg-white rounded-3xl shadow-2xl p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200">ID</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200">Type</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200">Amount</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200">Commission</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dashboard.history.latest_cash_operations?.length > 0 ? (
                        dashboard.history.latest_cash_operations.map(op => (
                          <tr key={op.cash_op_id} className="hover:bg-gray-50 transition-all duration-200">
                            <td className="px-4 py-3 text-gray-900 font-medium border-r border-gray-100 text-sm">#{op.cash_op_id}</td>
                            <td className="px-4 py-3 text-gray-700 border-r border-gray-100">
                              <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                {op.operation_type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-900 font-semibold border-r border-gray-100">${op.amount}</td>
                            <td className="px-4 py-3 text-gray-700 border-r border-gray-100">{op.agent_commission}%</td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                                op.status === 'completed' ? 'bg-green-100 text-green-800 border border-green-200' :
                                op.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                'bg-gray-100 text-gray-800 border border-gray-200'
                              }`}>
                                {op.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-12">
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                <CreditCard className="w-8 h-8 text-gray-400" />
                              </div>
                              <p className="text-gray-500">No cash operations found</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Users Growth Chart - Fixed to handle different data structures */}
          {usersPerDay.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">User Activity Over Time</h2>
              <LineChart
                labels={usersPerDay.map(d => d.date)}
                data={usersPerDay.map(d => d.total)}
                label="Unique Users per Day"
                gradientColor="245, 158, 11"
              />
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No user activity data available</p>
            </div>
          )}

          {/* Footer Note */}
          <p className="text-xs text-slate-500 text-center mt-8 pt-6 border-t border-gray-100">
            Performance metrics updated in real-time
          </p>
        </div>
      </div>
    </div>
  );
};

/* ---------------- User Dashboard ---------------- */
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

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-screen-2xl mx-auto"> {/* Changed to wider max-width */}
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span className="text-blue-600 font-semibold text-lg">User Dashboard</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">
            Welcome Back
          </h1>
          <p className="text-slate-500 mt-2">
            Overview of your transactions and account activity
          </p>
        </div>

        {/* Main Content Card */}
        <div className="w-full bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8">
          {/* Summary Grid */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Transaction Summary</h2>
            <SummaryGrid
              items={[
                { 
                  title: 'Total Transactions', 
                  value: dashboard.total_transactions ?? 0, 
                  icon: CreditCard 
                },
                { 
                  title: 'Pending', 
                  value: dashboard.pending ?? 0, 
                  icon: Clock 
                },
                { 
                  title: 'Completed', 
                  value: dashboard.done ?? 0, 
                  icon: CheckCircle 
                },
                { 
                  title: 'Total Sent', 
                  value: `$${dashboard.total_sent_amount ?? 0}`, 
                  icon: DollarSign 
                },
              ]}
            />
          </div>

          {/* Recent Transactions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Transactions</h2>
            <TransactionsTable transactions={dashboard.latest_transactions || []} />
          </div>

          {/* Footer Note */}
          <p className="text-xs text-slate-500 text-center mt-8 pt-6 border-t border-gray-100">
            Your transaction history is updated in real-time
          </p>
        </div>
      </div>
    </div>
  );
};