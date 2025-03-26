import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-role": "user"
        },
        body: JSON.stringify(sanitizedData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("User registration successful!");
        navigate("/login");
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">User Signup</h2>
      <form onSubmit={handleSignup} className="bg-white shadow-md rounded p-6">
        {/* Basic Information */}
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Basic Information</h3>
        <input type="text" name="userName" placeholder="User Name *" value={formData.userName} onChange={handleChange}
          className="w-full border rounded p-2 mb-2" required />

        <label className="text-sm text-gray-600">Date of Birth</label>
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
          className="w-full border rounded p-2 mb-2" />

        <select name="gender" value={formData.gender} onChange={handleChange}
          className="w-full border rounded p-2 mb-2">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <input type="text" name="nationality" placeholder="Nationality" value={formData.nationality} onChange={handleChange}
          className="w-full border rounded p-2 mb-2" />

        {/* Contact Info */}
        <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Contact Details</h3>
        <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleChange}
          className="w-full border rounded p-2 mb-2" required />
        <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange}
          className="w-full border rounded p-2 mb-2" />
        <input type="text" name="alternatePhoneNumber" placeholder="Alternate Phone" value={formData.alternatePhoneNumber} onChange={handleChange}
          className="w-full border rounded p-2 mb-2" />
        <input type="text" name="mailingAddress" placeholder="Mailing Address" value={formData.mailingAddress} onChange={handleChange}
          className="w-full border rounded p-2 mb-2" />

        {/* Identity */}
        <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Identity & Verification</h3>
        <input type="text" name="passportNumber" placeholder="Passport Number" value={formData.passportNumber} onChange={handleChange}
          className="w-full border rounded p-2 mb-2" />
        <input type="text" name="emergencyContactDetails" placeholder="Emergency Contact Details" value={formData.emergencyContactDetails} onChange={handleChange}
          className="w-full border rounded p-2 mb-2" />

        {/* Security */}
        <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Security</h3>
        <input type="password" name="password" placeholder="Password *" value={formData.password} onChange={handleChange}
          className="w-full border rounded p-2 mb-4" required />

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-300">
          Sign Up
        </button>

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default Signup;
