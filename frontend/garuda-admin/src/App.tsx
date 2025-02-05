import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import AdminLogin from './pages/AdminLogin'; // Renamed to AdminLogin
import AdminRegister from './pages/AdminRegister'; // Renamed to AdminRegister
import Home from './pages/Home';

const App = () => {
  console.log("App is rendering...");

  const [admin, setAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem("admin");
    return storedAdmin && storedAdmin !== "undefined" ? JSON.parse(storedAdmin) : null;
  });

  useEffect(() => {
    // Store admin info in localStorage to persist login state
    localStorage.setItem("admin", JSON.stringify(admin));
  }, [admin]);

  return (
    <Router>
      <Header admin={admin} setAdmin={setAdmin} />
      <Routes>
        <Route path="/" element={<Home admin={admin} />} /> {/* Pass admin to Home */}
        <Route path="/login" element={admin ? <Navigate to="/" /> : <AdminLogin setAdmin={setAdmin} />} />
        <Route path="/register" element={admin ? <Navigate to="/" /> : <AdminRegister setAdmin={setAdmin} />} /> {/* Pass setAdmin here */}
      </Routes>
    </Router>
  );
};

export default App;
