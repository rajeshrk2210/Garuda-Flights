import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("selectedFlight"); // ✅ Clear flight on logout
    logout();
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-white">GarudaFlights</Link>

      <div className="flex space-x-6">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/flights" className="hover:text-gray-300">Flights</Link>

        {!user ? (
          <>
            <Link to="/login" className="hover:text-gray-300">Login</Link>
            <Link to="/signup" className="hover:text-gray-300">SignUp</Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="hover:text-gray-300">Profile</Link>
            <button onClick={handleLogout} className="hover:text-red-300">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
