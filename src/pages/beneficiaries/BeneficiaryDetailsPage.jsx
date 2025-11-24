import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BeneficiaryDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [beneficiary, setBeneficiary] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/beneficiaries/${id}`)
      .then((res) => res.json())
      .then((data) => setBeneficiary(data));
  }, [id]);

  if (!beneficiary) return <p>Loading...</p>;

  return (
    <div>
      <h2>{beneficiary.name}</h2>
      <p>Phone: {beneficiary.phone}</p>

      <button onClick={() => navigate(`/beneficiaries/${id}/edit`)}>
        Edit
      </button>
    </div>
  );
}
