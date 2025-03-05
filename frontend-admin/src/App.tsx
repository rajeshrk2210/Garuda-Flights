import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";

const App = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { admin } = authContext;

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={admin ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={admin ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/dashboard" element={admin ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/admin" element={admin ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/profile" element={admin ? <Profile /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={admin ? "/dashboard" : "/"} />} />
      </Routes>
    </Router>
  );
};

export default App;
