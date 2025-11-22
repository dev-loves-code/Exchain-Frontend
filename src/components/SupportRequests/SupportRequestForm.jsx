import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const SupportRequestForm = ({ onRequestSent }) => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/support/request", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, description }), // matches controller
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed request:", res.status, data);
        alert(
          `Failed to send request: ${
            data.message || JSON.stringify(data.errors) || res.status
          }`
        );
        return;
      }

      alert(data.message || "Request sent!");
      setSubject("");
      setDescription("");
      onRequestSent();
    } catch (error) {
      console.error("Network error:", error);
      alert("Failed to send request due to network error.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="bg-teal-700 text-white px-4 py-2 rounded"
      >
        Send Request
      </button>
    </form>
  );
};

export default SupportRequestForm;
