import React, { useState } from "react";

export default function VerifyTransaction() {
  const [ref, setRef] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const onVerify = async () => {
    if (!ref) return alert("Reference code required");

    setLoading(true);
    try {
      const res = await fetch("/transactions/agent/wallet-to-person/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference_code: ref }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.message || "Verify failed");
      }

      const data = await res.json();
      setResult(data?.data || data);
    } catch (e) {
      console.error(e);
      alert(e.message || "Verify failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Agent - Verify Transaction</h2>
        <input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="Reference code"
          className="w-full px-4 py-3 border rounded-xl mb-4"
        />
        <div className="flex gap-3">
          <button
            disabled={loading}
            onClick={onVerify}
            className="px-4 py-3 bg-teal-800 text-white rounded-xl"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>

        {result && (
          <pre className="mt-4 bg-gray-100 p-4 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
