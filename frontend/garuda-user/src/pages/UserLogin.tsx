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
      console.log("Login Response:", data);  // Log the response to debug
  
      if (response.ok) {
        if (data.user) {
          setUser(data.user); // Set the user data if available
          localStorage.setItem("user", JSON.stringify(data.user)); // Store user in localStorage
          setLoginMessage("Logged in successfully!");
          navigate('/'); // Redirect to home page or dashboard after login
        } else {
          setLoginMessage("User data is missing.");
          console.error("User data is missing in the response");
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
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl mb-4">Login</h2>

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          className="block w-full p-2 mb-2 border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          className="block w-full p-2 mb-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Login button */}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Login
        </button>

        {/* Display login status message */}
        {loginMessage && (
          <p className="mt-4 text-green-500">{loginMessage}</p>
        )}
      </form>
    </div>
  );
};

export default UserLogin;
