import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiURL from "../config/config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New state for toggling password visibility
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch(`${apiURL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.removeItem("selectedFlight"); // Clear selected flight on login
      login(data.user, data.accessToken);
      navigate("/flights");
    } else {
      alert(data.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="mt-10 bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        {/* Header */}
        <h2 className="text-3xl font-bold text-teal-800 mb-6 text-center">Welcome Back</h2>
        <p className="text-gray-600 mb-8 text-center">Log in to your Garuda Flights account</p>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="flex text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-gray-800"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="flex text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle between text and password
                id="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-gray-800"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 !bg-white flex items-center pr-3 text-gray-500 hover:text-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-500 rounded"
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

          <button
            onClick={handleLogin}
            className="w-full bg-teal-700 text-white py-3 rounded-lg hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-500 transition duration-300 font-semibold shadow-md"
          >
            Log In
          </button>
        </div>

        {/* Signup Link */}
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-teal-600 hover:text-teal-800 font-medium transition duration-200"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;