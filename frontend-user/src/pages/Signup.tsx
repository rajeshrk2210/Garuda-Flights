import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!formData.userName || !formData.email || !formData.password) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, role: "user" }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful!");
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
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">User Signup</h2>

        <input type="text" name="userName" placeholder="User Name" className="input" value={formData.userName} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email Address" className="input" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="input" value={formData.password} onChange={handleChange} required />

        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md mt-6 hover:bg-blue-600 transition duration-300">
          Sign Up
        </button>

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default Signup;
