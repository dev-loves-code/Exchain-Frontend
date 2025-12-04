import React, { useState } from "react";

export default function CurrencySelector({ value, onChange }) {
  const currencies = ["USD", "EUR", "LBP"];
  const [selected, setSelected] = useState(value || currencies[0]);

  const handleChange = (e) => {
    setSelected(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <select
      value={selected}
      onChange={handleChange}
      className="px-4 py-3 bg-white border rounded-xl"
    >
      {currencies.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}
