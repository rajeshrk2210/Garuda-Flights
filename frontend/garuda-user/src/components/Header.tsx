import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Header = ({ user, setUser }: { user: any; setUser: (user: any) => void }) => {
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <header className="bg-blue-500 p-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Company Name */}
        <h1 className="text-white text-3xl font-semibold">Garuda Flights</h1>

        {/* Navbar */}
        <Navbar />

        {/* User Info / Auth Links */}
        <div className="flex space-x-4">
          {user ? (
            <>
              <span className="text-white">Welcome, {user.name}!</span>
              <button onClick={handleLogout} className="text-white hover:text-gray-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
              <Link to="/register" className="text-white hover:text-gray-300">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
