import React, { useEffect, useState } from "react";
import RefundCard from "../../components/refund-requests/RefundCard";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const AdminRefundsPage = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchRefunds = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/refund/requests-view-all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setRefunds(data);
      else setMessage(data.message || "Error fetching refunds");
    } catch (err) {
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const handleReject = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/refund/request-reject/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ rejected_reason: "Rejected by admin" }),
      });
      const data = await res.json();
      if (res.ok) {
        setRefunds(refunds.map(r => r.refund_id === id ? { ...r, status: "rejected" } : r));
      } else setMessage(data.message || "Error rejecting refund");
    } catch (err) {
      setMessage("Network error");
    }
  };

  const handleComplete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/refund/request-complete/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setRefunds(refunds.map(r => r.refund_id === id ? { ...r, status: "completed" } : r));
      } else setMessage(data.message || "Error completing refund");
    } catch (err) {
      setMessage("Network error");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">All Refund Requests</h1>
      {refunds.length === 0 ? (
        <p>No refund requests found.</p>
      ) : (
        refunds.map((r) => (
          <RefundCard
            key={r.refund_id}
            refund={r}
            onReject={handleReject}
            onComplete={handleComplete}
            isAdmin={true}
          />
        ))
      )}
      {message && <p className="mt-2 text-red-500">{message}</p>}
    </div>
  );
};

export default AdminRefundsPage;
