import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Flights from "./pages/Flights";
import ReviewFlight from "./pages/ReviewFlight";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer"; // New Footer import
import PassengerInfo from "./pages/PassengerInfo";
import ReviewBooking from "./pages/ReviewBooking";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/review-flight" element={<ReviewFlight />} />
            <Route path="/passenger" element={<PassengerInfo />} />
            <Route path="/review-booking" element={<ReviewBooking />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/confirmation" element={<Confirmation />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;