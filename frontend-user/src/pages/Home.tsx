import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to Garuda Flights</h1>
      <p className="text-lg text-gray-700 mb-6">Book your flights easily with Garuda Airline.</p>
      
      <div className="flex space-x-4">
        <Link to="/flights" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
          Search Flights
        </Link>
        <Link to="/login" className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition">
          Login
        </Link>
        <Link to="/signup" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">
          Signup
        </Link>
      </div>
    </div>
  );
};

export default Home;
