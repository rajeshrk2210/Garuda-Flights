import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { admin, logout } = authContext;

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center shadow-md">
      {/* Brand Name */}
      <h1 className="text-2xl font-bold text-white">Garuda Flights Admin</h1>

      {/* Navbar Links */}
      <ul className="flex space-x-6">
        {!admin ? (
          <>
            <li>
              <Link
                to="/"
                className="text-white font-bold text-lg !text-white hover:text-gray-300 transition duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="text-white font-bold text-lg !text-white hover:text-gray-300 transition duration-200"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="text-white font-bold text-lg !text-white hover:text-gray-300 transition duration-200"
              >
                Sign Up
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/dashboard"
                className="text-white font-bold text-lg !text-white hover:text-gray-300 transition duration-200"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                className="text-white font-bold text-lg !text-white hover:text-gray-300 transition duration-200"
              >
                Admin
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="text-white font-bold text-lg !text-white hover:text-gray-300 transition duration-200"
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logout}
                className="text-white font-bold text-lg !text-white hover:text-gray-300 transition duration-200"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
