import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Garuda Flights</h1>
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="hover:text-gray-300">Home</Link>
        </li>
        <li>
          <Link to="/login" className="hover:text-gray-300">Login</Link>
        </li>
        <li>
          <Link to="/signup" className="hover:text-gray-300">Sign Up</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
