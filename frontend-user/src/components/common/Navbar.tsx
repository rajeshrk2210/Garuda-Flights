import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-700 text-white flex justify-between items-center px-6 py-4">
      <Link to="/" className="text-xl font-bold">GarudaFlights</Link>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/flights">Flights</Link>
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">SignUp</Link>
          </>
        ) : (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={logout} className="ml-2">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
