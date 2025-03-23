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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [aircraftRes, locationsRes, routesRes, flightsRes] = await Promise.all([
          fetch("http://localhost:5000/api/aircrafts/count"),
          fetch("http://localhost:5000/api/routes/locations"),
          fetch("http://localhost:5000/api/routes/count"),
          fetch("http://localhost:5000/api/flights/stats", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const aircraftCount = await aircraftRes.json();
        const locationData: string[] = await locationsRes.json();
        const routeCount = await routesRes.json();
        const flightStats = await flightsRes.json();

        setAircrafts(aircraftCount);
        setLocations(locationData.length);
        setRoutes(routeCount);
        setFlights(flightStats);
      } catch (error) {
        console.error("❌ Dashboard API error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg">Aircrafts: {aircrafts}</div>
        <div className="bg-green-500 text-white p-4 rounded-lg">Locations Covered: {locations}</div>
        <div className="bg-purple-500 text-white p-4 rounded-lg">Routes: {routes}</div>
      </div>

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
    </div>
  );
};

export default Dashboard;