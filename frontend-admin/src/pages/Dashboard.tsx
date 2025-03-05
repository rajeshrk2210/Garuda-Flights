import { useEffect, useState } from "react";

const Dashboard = () => {
  const [aircrafts, setAircrafts] = useState<number>(0);
  const [locations, setLocations] = useState<number>(0);
  const [routes, setRoutes] = useState<number>(0);
  const [flights, setFlights] = useState({
    today: 0,
    week: 0,
    month: 0,
    cancelledToday: 0,
    cancelledWeek: 0,
    cancelledMonth: 0,
    delayedToday: 0,
    delayedWeek: 0,
    delayedMonth: 0,
  });
  const [searchParams, setSearchParams] = useState({
    aircraftNumber: "",
    departure: "",
    arrival: "",
    date: "",
  });

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      const aircraftResponse = await fetch("http://localhost:5000/aircrafts/count");
      const locationsResponse = await fetch("http://localhost:5000/locations/count");
      const routesResponse = await fetch("http://localhost:5000/routes/count");
      const flightsResponse = await fetch("http://localhost:5000/flights/stats");

      setAircrafts(await aircraftResponse.json());
      setLocations(await locationsResponse.json());
      setRoutes(await routesResponse.json());
      setFlights(await flightsResponse.json());
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg">Aircrafts: {aircrafts}</div>
        <div className="bg-green-500 text-white p-4 rounded-lg">Locations Covered: {locations}</div>
        <div className="bg-purple-500 text-white p-4 rounded-lg">Routes: {routes}</div>
      </div>

      {/* Flight Stats */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="bg-yellow-500 text-white p-4 rounded-lg">Flights Today: {flights.today}</div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg">Flights This Week: {flights.week}</div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg">Flights This Month: {flights.month}</div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="bg-red-500 text-white p-4 rounded-lg">Cancelled Today: {flights.cancelledToday}</div>
        <div className="bg-red-500 text-white p-4 rounded-lg">Cancelled This Week: {flights.cancelledWeek}</div>
        <div className="bg-red-500 text-white p-4 rounded-lg">Cancelled This Month: {flights.cancelledMonth}</div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="bg-orange-500 text-white p-4 rounded-lg">Delayed Today: {flights.delayedToday}</div>
        <div className="bg-orange-500 text-white p-4 rounded-lg">Delayed This Week: {flights.delayedWeek}</div>
        <div className="bg-orange-500 text-white p-4 rounded-lg">Delayed This Month: {flights.delayedMonth}</div>
      </div>

      {/* Flight Search */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-2xl font-bold">Search Flights</h2>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <input
            type="text"
            placeholder="Aircraft Number"
            value={searchParams.aircraftNumber}
            onChange={(e) => setSearchParams({ ...searchParams, aircraftNumber: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Departure"
            value={searchParams.departure}
            onChange={(e) => setSearchParams({ ...searchParams, departure: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Arrival"
            value={searchParams.arrival}
            onChange={(e) => setSearchParams({ ...searchParams, arrival: e.target.value })}
            className="p-2 border rounded"
          />
          <button className="bg-blue-500 text-white p-2 rounded">Search</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
