import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r to-teal-700 from-cyan-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Fly Across Canada with Garuda Flights
          </h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            From Toronto to Vancouver, explore Canada and beyond with unbeatable flight deals.
          </p>
          <button
            onClick={() => navigate("/flights")}
            className="bg-teal-100 text-white cursor-pointer px-8 py-3 rounded-lg text-lg font-semibold hover:bg-teal-200 focus:ring-4 focus:ring-teal-500 transition duration-300 shadow-md"
          >
            Book Your Flight Now
          </button>
        </div>
        <div className="absolute inset-0 bg-gray-900 opacity-20"></div>
      </section>

      {/* Promotional Offers Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-teal-800 mb-6">
            🔥 Hot Canadian Travel Deals
          </h2>
          <ul className="space-y-6 text-gray-800 text-lg">
            <li className="flex items-start">
              <span className="text-teal-600 mr-3 text-2xl">🍁</span>
              <span>
                <strong className="font-semibold">15% Off Cross-Canada Flights</strong> - Save on trips from coast to coast.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-600 mr-3 text-2xl">💰</span>
              <span>
                <strong className="font-semibold">$50 Cashback</strong> - Pay with Interac for instant rewards.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-600 mr-3 text-2xl">⛄</span>
              <span>
                <strong className="font-semibold">Winter Getaway Discounts</strong> - Book early for ski trips or warm escapes.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
          Popular Canadian Destinations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Toronto", desc: "Vibrant city life awaits.", price: "From $99" },
            { name: "Vancouver", desc: "Nature meets urban charm.", price: "From $149" },
            { name: "Calgary", desc: "Gateway to the Rockies.", price: "From $129" },
          ].map((dest) => (
            <div
              key={dest.name}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300"
            >
              <h3 className="text-xl font-semibold text-teal-800 mb-2">{dest.name}</h3>
              <p className="text-gray-700 mb-4">{dest.desc}</p>
              <p className="text-teal-700 font-bold mb-4">{dest.price}</p>
              <button
                onClick={() => navigate("/flights")}
                className="w-full bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800 focus:ring-4 focus:ring-teal-500 transition duration-300"
              >
                Explore Flights
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r to-teal-700 from-cyan-600 text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl sm:text-2xl mb-6 leading-relaxed">
            Ready to take off? Join thousands of Canadians flying with Garuda Flights.
          </p>
          <a
            href="/signup"
            className="inline-block bg-white text-teal-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 focus:ring-4 focus:ring-teal-500 transition duration-300"
          >
            Sign Up for Exclusive Offers
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;