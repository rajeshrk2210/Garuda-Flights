import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="h-[500px] bg-cover bg-center flex flex-col items-center justify-center text-white"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      >
        <h1 className="text-5xl font-bold">Book Your Flight with Garuda Flights</h1>
        <p className="text-lg mt-4">Fast, Secure & Affordable</p>
        <Link to="/flights" className="mt-6 px-6 py-3 bg-yellow-500 text-xl rounded-lg hover:bg-yellow-600">
          Book Now
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-screen-lg mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h3 className="text-2xl font-semibold">Best Prices</h3>
              <p className="mt-2 text-gray-600">We offer the most competitive prices on flight tickets.</p>
            </div>
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h3 className="text-2xl font-semibold">Easy Booking</h3>
              <p className="mt-2 text-gray-600">Book your flight hassle-free with just a few clicks.</p>
            </div>
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h3 className="text-2xl font-semibold">24/7 Support</h3>
              <p className="mt-2 text-gray-600">Our customer support team is available round the clock.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <h2 className="text-4xl font-bold">Ready to Fly?</h2>
        <p className="text-lg mt-4">Find the best flights with us now.</p>
        <Link to="/flights" className="mt-6 px-6 py-3 bg-blue-500 text-white text-xl rounded-lg hover:bg-blue-600">
          Find Flights
        </Link>
      </section>
    </div>
  );
};

export default Home;
