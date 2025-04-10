import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r to-teal-700 from-cyan-600 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Brand Section */}
        <div>
          <h3 className="text-xl font-bold mb-4">Garuda Flights</h3>
          <p className="text-gray-200 text-sm">
            Your trusted partner for affordable flights across Canada and beyond.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-200 text-sm font-light">
            <li>
              <Link to="/" className="!text-gray-200 hover:border-b transition duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link to="/flights" className="!text-gray-200 hover:border-b transition duration-200">
                Search Flights
              </Link>
            </li>
            <li>
              <Link to="/profile" className="!text-gray-200 hover:border-b transition duration-200">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
          <p className="text-gray-200 text-sm">Email: support@garudaflights.ca</p>
          <p className="text-gray-200 text-sm">Phone: 1-800-GARUDA1</p>
          <p className="text-gray-200 text-sm">Based in Toronto, Canada</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-teal-400 text-center text-gray-300 text-sm">
        <p>&copy; {new Date().getFullYear()} Garuda Flights. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;