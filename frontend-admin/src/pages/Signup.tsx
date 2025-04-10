import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiURL from "../config/config";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    email: "",
    phoneNumber: "",
    alternatePhoneNumber: "",
    mailingAddress: "",
    passportNumber: "",
    emergencyContactDetails: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!formData.userName || !formData.email || !formData.password) {
      setMessage("Username, Email, and Password are required.");
      return;
    }

    const sanitizedData = {
      role: "admin",
      userName: formData.userName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      dateOfBirth: formData.dateOfBirth || "",
      gender: formData.gender || "",
      nationality: formData.nationality || "",
      phoneNumber: formData.phoneNumber || "",
      alternatePhoneNumber: formData.alternatePhoneNumber || "",
      mailingAddress: formData.mailingAddress || "",
      passportNumber: formData.passportNumber || "",
      emergencyContactDetails: formData.emergencyContactDetails || "",
    };

    try {
      const response = await fetch(`${apiURL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-frontend-origin": "admin",
        },
        body: JSON.stringify(sanitizedData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Admin Registration successful!");
        navigate("/login");
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(String(error) || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-8 px-6">
      <form
        onSubmit={handleSignup}
        className="bg-white rounded-xl shadow-sm p-6 w-full max-w-2xl border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-teal-700 mb-8 text-center">Admin Signup</h2>

        {/* Basic Information */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h3>
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">User Name *</label>
          <input
            type="text"
            name="userName"
            placeholder="User Name"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Date of Birth (Optional)</label>
          <input
            type="date"
            name="dateOfBirth"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Gender (Optional)</label>
          <select
            name="gender"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Nationality (Optional)</label>
          <input
            type="text"
            name="nationality"
            placeholder="Nationality"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            value={formData.nationality}
            onChange={handleChange}
          />
        </div>

        {/* Contact Details */}
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Contact Details</h3>
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Email Address *</label>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Phone Number (Optional)</label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Alternate Phone (Optional)</label>
          <input
            type="text"
            name="alternatePhoneNumber"
            placeholder="Alternate Phone"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            value={formData.alternatePhoneNumber}
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Mailing Address (Optional)</label>
          <input
            type="text"
            name="mailingAddress"
            placeholder="Mailing Address"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            value={formData.mailingAddress}
            onChange={handleChange}
          />
        </div>

        {/* Identity & Verification */}
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Identity & Verification</h3>
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Passport Number (Optional)</label>
          <input
            type="text"
            name="passportNumber"
            placeholder="Passport Number"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            value={formData.passportNumber}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Emergency Contact Details (Optional)</label>
          <input
            type="text"
            name="emergencyContactDetails"
            placeholder="Emergency Contact Details"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            value={formData.emergencyContactDetails}
            onChange={handleChange}
          />
        </div>

        {/* Security & Account Settings */}
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Security & Account Settings</h3>
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600">Password *</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200"
        >
          Sign Up
        </button>

        {/* Registration Status Message */}
        {message && (
          <p className={`mt-4 text-center ${message.includes("successful") ? "text-teal-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Signup;