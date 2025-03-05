import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { user, logout } = authContext;

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold text-white">Garuda Flights</h1>

      <ul className="flex space-x-6">
        <li><Link to="/" className="text-white font-bold">Home</Link></li>
        <li><Link to="/flights" className="text-white font-bold">Flights</Link></li>
        {!user ? (
          <>
            <li><Link to="/login" className="text-white font-bold">Login</Link></li>
            <li><Link to="/signup" className="text-white font-bold">Signup</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/my-bookings" className="text-white font-bold">My Bookings</Link></li>
            <li><Link to="/profile" className="text-white font-bold">Profile</Link></li>
            <li><button onClick={logout} className="text-white font-bold">Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
