import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const SupportRequestList = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/support/request?order_by=latest",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to fetch requests:", res.status, data);
        return;
      }

      setRequests(data); // controller already returns array of requests
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <p>Loading support requests...</p>;
  if (requests.length === 0) return <p>No support requests found.</p>;

  return (
    <div className="space-y-4">
      {requests.map((r) => (
        <div key={r.support_id} className="p-4 border rounded shadow">
          <h3 className="font-bold">{r.subject}</h3>
          <p>Status: {r.status}</p>
          <p>Sent at: {new Date(r.sent_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default SupportRequestList;
