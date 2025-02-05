import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import Home from './pages/Home';

const App = () => {
  console.log("App is rendering...");

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  });  
  

  useEffect(() => {
    // Store user info in localStorage to persist login state
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <Router>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <UserLogin setUser={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <UserRegister />} />
      </Routes>
    </Router>
  );
};

export default App;
