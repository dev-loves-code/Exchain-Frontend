import React, { useEffect, useState } from "react";
import BeneficiaryForm from "../../components/beneficiaries/BeneficiaryForm";
import { useNavigate, useParams } from "react-router-dom";

export default function EditBeneficiaryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://127.0.0.1:8000/api";

  useEffect(() => {
    const fetchBeneficiary = async () => {
      try {
        setError(""); // clear previous errors
        const token = localStorage.getItem("token");
        if (!token) throw new Error("You must be logged in");

        const res = await fetch(`${API_BASE_URL}/beneficiaries/view/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          if (res.status === 404) throw new Error("Beneficiary not found.");
          throw new Error(errorData?.message || `HTTP error: ${res.status}`);
        }

        const data = await res.json();
        if (data.success) {
          setInitialData(data.beneficiary);
        } else {
          throw new Error(data.message || "Failed to load beneficiary");
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Network error. Please check your backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchBeneficiary();
  }, [id]);

  const handleSubmit = async (formData) => {
  try {
    setError("");
    const token = localStorage.getItem("token");
    if (!token) throw new Error("You must be logged in");

    const res = await fetch(`${API_BASE_URL}/beneficiaries/update/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error: ${res.status}`);
    }

    const data = await res.json();
    if (data.success) {
      alert("Beneficiary updated successfully!");
      navigate("/beneficiaries"); // <- go back to list page
    } else {
      throw new Error(data.message || "Failed to update beneficiary");
    }
  } catch (err) {
    console.error(err);
    setError(err.message || "Network error. Please check your backend.");
  }
};


  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Beneficiary</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
          {error}
          <br />
          <button
            onClick={() => navigate("/beneficiaries")}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back to Beneficiaries List
          </button>
        </div>
      )}

      {!error && initialData && (
        <BeneficiaryForm
          mode="edit"
          initialData={initialData}
          onSuccess={handleSubmit}
        />
      )}

      {!error && !initialData && !loading && (
        <div className="p-3 text-gray-700">
          Beneficiary data is empty or could not be loaded.
        </div>
      )}
    </div>
  );
}
