import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <ul className="flex space-x-6">
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
      </ul>
    </nav>
  );
};

export default Navbar;
