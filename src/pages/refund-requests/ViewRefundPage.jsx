import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RefundCard from "../../components/refund-requests/RefundCard";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const ViewRefundPage = () => {
  const { id } = useParams();
  const [refund, setRefund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchRefund = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/refund/request-view/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setRefund({ ...data, refund_id: id });
      else setMessage(data.message || "Error fetching refund");
    } catch (err) {
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefund();
  }, [id]);

  const handleCancel = async (refundId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/refund/request-cancel/${refundId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Refund canceled successfully");
        setRefund({ ...refund, status: "canceled" });
      } else {
        setMessage(data.message || "Error canceling refund");
      }
    } catch (err) {
      setMessage("Network error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!refund) return <p>{message || "Refund not found"}</p>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">Refund Request Details</h1>
      <RefundCard refund={refund} onCancel={handleCancel} isAdmin={false} />
      {message && <p className="mt-2 text-red-500">{message}</p>}
    </div>
  );
};

export default ViewRefundPage;
