import React, { useState } from 'react';

const UserRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');

  const handleRegister = async () => {
    // Call your backend API for user registration
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg">
      <h2 className="text-2xl mb-4">User Register</h2>
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
      <select 
        className="w-full p-2 mb-4 border border-gray-300 rounded" 
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="client">Client</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={handleRegister} className="w-full p-2 bg-blue-500 text-white rounded">
        Register
      </button>
    </div>
  );
};

export default UserRegister;
