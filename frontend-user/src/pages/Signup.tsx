import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  const [showPassword, setShowPassword] = useState(false);

  // Fixed: Added explicit typing for the event parameter
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fixed: Added explicit typing for the event parameter
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (!formData.userName || !formData.email || !formData.password) {
      setMessage("Username, Email, and Password are required.");
      return;
    }

    const sanitizedData = {
      role: "user",
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
          "x-role": "user",
        },
        body: JSON.stringify(sanitizedData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("User registration successful!");
        setTimeout(() => navigate("/login"), 1500); // Delay for user to see success message
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage( String(error) || "Something went wrong. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        {/* Header */}
        <h2 className="text-3xl font-bold text-teal-800 mb-6 text-center">Create Your Account</h2>
        <p className="text-gray-600 mb-8 text-center">Sign up to start booking flights with Garuda Flights</p>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-left text-lg font-semibold text-teal-700 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="userName" className="flex text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  placeholder="Enter your username"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-gray-800"
                  required
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="flex text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="gender" className="flex text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="nationality" className="flex text-sm font-medium text-gray-700 mb-1">
                  Nationality
                </label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  placeholder="Enter your nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-left text-lg font-semibold text-teal-700 mb-4">Contact Details</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="flex text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-gray-800"
                  required
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="flex text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="alternatePhoneNumber" className="flex text-sm font-medium text-gray-700 mb-1">
                  Alternate Phone
                </label>
                <input
                  type="text"
                  id="alternatePhoneNumber"
                  name="alternatePhoneNumber"
                  placeholder="Enter alternate phone"
                  value={formData.alternatePhoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-gray-800"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="mailingAddress" className="flex text-sm font-medium text-gray-700 mb-1">
                  Mailing Address
                </label>
                <input
                  type="text"
                  id="mailingAddress"
                  name="mailingAddress"
                  placeholder="Enter your mailing address"
                  value={formData.mailingAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Identity & Verification */}
          <div>
            <h3 className="text-left text-lg font-semibold text-teal-700 mb-4">Identity & Verification</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="passportNumber" className="flex text-sm font-medium text-gray-700 mb-1">
                  Passport Number
                </label>
                <input
                  type="text"
                  id="passportNumber"
                  name="passportNumber"
                  placeholder="Enter your passport number"
                  value={formData.passportNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="emergencyContactDetails" className="flex text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  id="emergencyContactDetails"
                  name="emergencyContactDetails"
                  placeholder="Enter emergency contact details"
                  value={formData.emergencyContactDetails}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Security */}
          <div>
            <h3 className="text-left text-lg font-semibold text-teal-700 mb-4">Security</h3>
            <div className="relative">
              <label htmlFor="password" className="flex text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-gray-800"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 !bg-white text-gray-500 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
                ) : (
                  <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-700 text-white py-3 rounded-lg hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-500 transition duration-300 font-semibold shadow-md"
          >
            Sign Up
          </button>

          {/* Message */}
          {message && (
            <p
              className={`mt-6 text-center text-sm ${
                message.includes("successful") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          {/* Login Link */}
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-teal-600 hover:text-teal-800 font-medium transition duration-200"
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;