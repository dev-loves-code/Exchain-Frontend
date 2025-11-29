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
  const [locationLoading, setLocationLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  // -------------------------------
  // AUTO-GET USER LOCATION + REVERSE GEOCODE
  // -------------------------------
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;

          console.log("Accurate geolocation:", { latitude, longitude, accuracy });

          // First, set the coordinates
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));

          // Then reverse geocode to get address details
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18`,
              {
                headers: {
                  'User-Agent': 'PayOne-Agent-Registration/1.0'
                }
              }
            );
            
            const data = await response.json();
            
            console.log("Full geocoding response:", data);
            
            if (data && data.address) {
              // Try multiple fields for street address
              const street = data.address.road || 
                            data.address.street || 
                            data.address.pedestrian ||
                            data.address.path ||
                            data.address.neighbourhood ||
                            data.address.suburb ||
                            data.display_name?.split(',')[0] || // Fallback to first part of display name
                            "";
              
              const city = data.address.city || 
                          data.address.town || 
                          data.address.village || 
                          data.address.municipality ||
                          data.address.county ||
                          "";

              console.log("Extracted address:", { 
                street, 
                city, 
                fullDisplayName: data.display_name,
                allAddressFields: data.address 
              });

              setFormData((prev) => ({
                ...prev,
                address: street || "Address not available - please update manually",
                city: city || "City not available - please update manually",
              }));
            }
          } catch (error) {
            console.error("Geocoding error:", error);
            setFormData((prev) => ({
              ...prev,
              address: "Unable to detect address",
              city: "Unable to detect city",
            }));
          } finally {
            setLocationLoading(false);
          }
        },
        (err) => {
          console.warn("Location error:", err);
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationLoading(false);
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

        {locationLoading && (
          <div className="bg-blue-50 text-blue-600 p-4 rounded-lg text-sm mb-4 text-center">
            📍 Detecting your location...
          </div>
        )}

        {!locationLoading && formData.latitude && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg text-sm mb-4 text-center">
            ✓ Location detected: {formData.city || "Location confirmed"}
          </div>
        )}

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
              <div>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  placeholder="Business Name *"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {errors.business_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.business_name[0]}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="business_license"
                  value={formData.business_license}
                  onChange={handleChange}
                  placeholder="Business License"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {errors.business_license && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.business_license[0]}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street Address (auto-detected, editable)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-detected - you can edit if incorrect
                </p>
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address[0]}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City (auto-detected, editable)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-detected - you can edit if incorrect
                </p>
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.city[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Working Hours
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Working Hours Start *
                </label>
                <input
                  type="time"
                  name="working_hours_start"
                  value={formData.working_hours_start}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {errors.working_hours_start && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.working_hours_start[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Working Hours End *
                </label>
                <input
                  type="time"
                  name="working_hours_end"
                  value={formData.working_hours_end}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {errors.working_hours_end && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.working_hours_end[0]}
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              * Please specify your business operating hours in 24-hour format (HH:MM)
            </p>
          </div>

          {/* Hidden Latitude & Longitude */}
          <input type="hidden" name="latitude" value={formData.latitude} />
          <input type="hidden" name="longitude" value={formData.longitude} />

          <button
            onClick={handleSubmit}
            disabled={loading || locationLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : locationLoading ? "Detecting location..." : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentSignupPage;