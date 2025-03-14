import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserLogin = ({ setUser }: { setUser: (user: any) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (data.user && data.token) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
          setLoginMessage("Logged in successfully!");
          navigate('/'); // Redirect to home or dashboard
        } else {
          setLoginMessage("User data or token is missing.");
        }
      } else {
        setLoginMessage(data.message || "Login failed.");
      }
    } catch (error) {
      setLoginMessage("Login failed. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="max-w-sm w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          className="block w-full p-3 mb-4 border border-gray-300 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          className="block w-full p-3 mb-4 border border-gray-300 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Login button */}
        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600">
          Login
        </button>

        {/* Login status message */}
        {loginMessage && (
          <p className="mt-4 text-center text-red-500">{loginMessage}</p>
        )}
      </form>
    </div>
  );
};

export default UserLogin;
