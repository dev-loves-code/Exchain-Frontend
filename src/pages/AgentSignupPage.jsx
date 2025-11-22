import { useState, useEffect } from "react";

const AgentSignupPage = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
    business_name: "",
    business_license: "",
    latitude: "",
    longitude: "",
    address: "",
    city: "",
    working_hours_start: "",
    working_hours_end: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // -------------------------------
  // AUTO-GET USER LOCATION
  // -------------------------------
  useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;

        console.log("Accurate geolocation:", { latitude, longitude, accuracy });

        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
      },
      (err) => {
        console.warn("Location error:", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0, // prevents cached data!
      }
    );
  }
}, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async () => {
    setErrors({});
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/register/agent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(
          data.message ||
            "Agent registration submitted successfully! Awaiting approval."
        );

        setFormData({
          full_name: "",
          email: "",
          phone_number: "",
          password: "",
          password_confirmation: "",
          business_name: "",
          business_license: "",
          latitude: "",
          longitude: "",
          address: "",
          city: "",
          working_hours_start: "",
          working_hours_end: "",
        });

        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        setErrors(data.errors || { general: data.message });
      }
    } catch (error) {
      setErrors({ general: "Network error. Please try again." });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">
          Become an Agent
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Join PayOne's agent network
        </p>

        {/* REMOVED GOOGLE AUTH BUTTON */}

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-gray-500 text-sm">
              Register below
            </span>
          </div>
        </div>

        {successMessage && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg text-sm mb-4 text-center">
            {successMessage}
          </div>
        )}

        {errors.general && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">
            {errors.general}
          </div>
        )}

        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "full_name", placeholder: "Full Name *", type: "text" },
                { name: "email", placeholder: "Email *", type: "email" },
                {
                  name: "phone_number",
                  placeholder: "Phone Number *",
                  type: "tel",
                },
                {
                  name: "password",
                  placeholder: "Password *",
                  type: "password",
                },
                {
                  name: "password_confirmation",
                  placeholder: "Confirm Password *",
                  type: "password",
                },
              ].map((field) => (
                <div key={field.name}>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field.name][0]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Business Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Business Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "business_name",
                  placeholder: "Business Name *",
                  type: "text",
                },
                {
                  name: "business_license",
                  placeholder: "Business License",
                  type: "text",
                },
                { name: "address", placeholder: "Address", type: "text" },
                { name: "city", placeholder: "City", type: "text" },
              ].map((field) => (
                <div key={field.name}>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field.name][0]}
                    </p>
                  )}
                </div>
              ))}

              {/* Hidden Latitude & Longitude */}
              <input type="hidden" name="latitude" value={formData.latitude} />
              <input type="hidden" name="longitude" value={formData.longitude} />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Submitting..." : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentSignupPage;
