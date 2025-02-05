import React, { useState } from 'react';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async () => {
    // Call your backend API for user login
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg">
      <h2 className="text-2xl mb-4">User Login</h2>
      <input 
        type="email" 
        className="w-full p-2 mb-4 border border-gray-300 rounded" 
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password" 
        className="w-full p-2 mb-4 border border-gray-300 rounded" 
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="w-full p-2 bg-blue-500 text-white rounded">
        Login
      </button>
    </div>
  );
};

export default UserLogin;
