import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Flights from "./pages/Flights";
import Profile from "./pages/Profile";
import MyBookings from "./pages/MyBookings";

const App = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { user } = authContext;

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/login" element={user ? <Navigate to="/flights" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/flights" /> : <Signup />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/my-bookings" element={user ? <MyBookings /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
