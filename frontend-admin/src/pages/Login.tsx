import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);
  if (!authContext) return <div className="p-6 text-gray-600">Auth context not available</div>;
  const { login } = authContext;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Start loading

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Token from backend:", data.accessToken);
        login(data.accessToken, data.user);
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-8 px-6">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-xl shadow-sm p-6 w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-teal-700 mb-8 text-center">Admin Login</h2>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading} // Disable input while loading
          />
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            placeholder="Password"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading} // Disable input while loading
          />
        </div>

        <button
          type="submit"
          className={`w-full px-4 py-3 rounded-lg text-white transition duration-200 flex items-center justify-center ${
            loading ? "bg-teal-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
          }`}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                ></path>
              </svg>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default Login;