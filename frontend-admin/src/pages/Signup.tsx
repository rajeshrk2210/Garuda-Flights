import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  // ✅ Ensure all fields match backend expectations
  const [formData, setFormData] = useState({
    userName: "", // 🔹 Changed from username to userName
    dateOfBirth: "", // 🔹 Changed from dob to dateOfBirth
    gender: "",
    nationality: "",
    email: "",
    phoneNumber: "", // 🔹 Changed from phone to phoneNumber
    alternatePhoneNumber: "", // 🔹 Changed from alternatePhone
    mailingAddress: "", // 🔹 Changed from address
    passportNumber: "",
    emergencyContactDetails: "", // 🔹 Changed from emergencyContact
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

    // ✅ Convert empty strings to ""
    const sanitizedData = {
      role: "admin", // ✅ Force role to admin
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
      const response = await fetch("http://localhost:5000/auth/register", {
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
      setMessage("Something went wrong. Please try again.");
    }
  };



  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSignup} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Admin Signup</h2>

        {/* Basic Information */}
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Basic Information</h3>
        <input type="text" name="userName" placeholder="User Name *" className="input" value={formData.userName} onChange={handleChange} required />

        {/* DOB */}
        <label className="block text-gray-700 text-sm font-medium mt-2">Date of Birth (Optional)</label>
        <input type="date" name="dateOfBirth" className="input" value={formData.dateOfBirth} onChange={handleChange} />

        <select name="gender" className="input" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender (Optional)</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input type="text" name="nationality" placeholder="Nationality (Optional)" className="input" value={formData.nationality} onChange={handleChange} />

        {/* Contact Details */}
        <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Contact Details</h3>
        <input type="email" name="email" placeholder="Email Address *" className="input" value={formData.email} onChange={handleChange} required />
        <input type="text" name="phoneNumber" placeholder="Phone Number (Optional)" className="input" value={formData.phoneNumber} onChange={handleChange} />
        <input type="text" name="alternatePhoneNumber" placeholder="Alternate Phone (Optional)" className="input" value={formData.alternatePhoneNumber} onChange={handleChange} />

        {/* Address */}
        <input type="text" name="mailingAddress" placeholder="Mailing Address (Optional)" className="input" value={formData.mailingAddress} onChange={handleChange} />

        {/* Identity & Verification */}
        <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Identity & Verification</h3>
        <input type="text" name="passportNumber" placeholder="Passport Number (Optional)" className="input" value={formData.passportNumber} onChange={handleChange} />
        <input type="text" name="emergencyContactDetails" placeholder="Emergency Contact Details (Optional)" className="input" value={formData.emergencyContactDetails} onChange={handleChange} />

        {/* Security & Account Settings */}
        <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Security & Account Settings</h3>
        <input type="password" name="password" placeholder="Password *" className="input w-full" value={formData.password} onChange={handleChange} required />

        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md mt-6 hover:bg-blue-600 transition duration-300">
          Sign Up
        </button>

        {/* Registration Status Message */}
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default Signup;
