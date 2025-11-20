import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AgentProfilePage() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`http://127.0.0.1:8000/api/agents/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch agent");
        return res.json();
      })
      .then((data) => {
        if (data.success) setAgent(data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading agent profile...</p>;
  if (!agent) return <p>Agent not found.</p>;

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <h1 className="text-4xl font-bold mb-6">
          {agent.business_name || agent.name}
        </h1>
        <div className="space-y-4">
          <p><strong>City:</strong> {agent.city}</p>
          <p><strong>Address:</strong> {agent.address || "N/A"}</p>
          <p>
            <strong>Working Hours:</strong> {agent.working_hours_start} - {agent.working_hours_end}
          </p>
          <p><strong>Commission Rate:</strong> {agent.commission_rate ?? "N/A"}%</p>
          <p><strong>Phone:</strong> {agent.phone_number || "N/A"}</p>
          <p><strong>Email:</strong> {agent.email || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}
