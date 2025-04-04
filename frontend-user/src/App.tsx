import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Flights from "./pages/Flights";
import ReviewFlight from "./pages/ReviewFlight"; // ✅ Make sure this import exists
import Navbar from "./components/common/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/review-flight" element={<ReviewFlight />} />        
      </Routes>
    </Router>
  );
}

export default App;
