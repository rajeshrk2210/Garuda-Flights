import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("selectedFlight");
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r to-teal-700 from-cyan-600 text-white px-4 sm:px-6 lg:px-8 py-4 shadow-lg flex items-center justify-between sticky top-0 z-50">
      {/* Brand Logo */}
      <div onClick={() => navigate("/")} className="cursor-pointer text-2xl font-bold tracking-tight !text-white hover:text-teal-200 transition duration-200">
        Garuda Flights
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-4 text-sm sm:text-base">
        <Link
          to="/"
          className="!text-white hover:text-teal-200 focus:text-teal-200 transition duration-200 rounded px-4 py-2 hover:bg-teal-600"
        >
          Home
        </Link>
        <Link
          to="/flights"
          className="!text-white hover:text-teal-200 focus:text-teal-200 transition duration-200 rounded px-4 py-2 hover:bg-teal-600"
        >
          Flights
        </Link>

        {!user ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 hover:bg-teal-600 focus:bg-teal-700 !text-white transition duration-200 rounded"
            >
              Login
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/profile"
              className="!text-white hover:text-teal-200 focus:text-teal-200 transition duration-200 rounded"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 focus:bg-red-700 text-white transition duration-200 focus:ring-red-500 shadow-md"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;