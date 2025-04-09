import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Garuda Flights</h1>
      <p className="text-lg mb-6">Best deals on domestic and international travel.</p>
      
      {/* Promotional Offers Section */}
      <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">🔥 Special Offers</h2>
        <ul className="list-disc list-inside text-left">
          <li>20% off on round trip bookings!</li>
          <li>Flat ₹500 cashback on payments via UPI.</li>
          <li>Early bird discounts for summer vacations.</li>
        </ul>
      </div>

      <button
        onClick={() => navigate("/flights")}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition duration-200"
      >
        Search Flights
      </button>
    </div>
  );
};

export default Home;
