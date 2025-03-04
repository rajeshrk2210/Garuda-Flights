import { Link } from "react-router-dom";

const Navbar = ({ user, setUser }: { user: any; setUser: (user: any) => void }) => {
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <nav>
      <ul className="flex items-center space-x-6">
        {/* Left Side Links */}
        <li>
          <Link to="/" className="text-white hover:text-gray-300">Home</Link>
        </li>
        <li>
          <Link to="/flights" className="text-white hover:text-gray-300">Flights</Link>
        </li>
        <li>
          <Link to="/about" className="text-white hover:text-gray-300">About Us</Link>
        </li>
        <li>
          <Link to="/contact" className="text-white hover:text-gray-300">Contact</Link>
        </li>

        {/* Right Side User Info / Auth Links */}
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-white">Welcome, {user.email}!</span>
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
      </ul>
    </nav>
  );
};

export default Navbar;
