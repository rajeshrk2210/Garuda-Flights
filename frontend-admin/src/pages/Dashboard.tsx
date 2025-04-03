import React from "react";
import { useEffect, useState } from "react";
import {
  FaPlane,
  FaMapMarkerAlt,
  FaRoute,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendarAlt,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

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
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">✈️ Garuda Admin Dashboard</h1>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard icon={<FaPlane />} label="Total Aircrafts" value={aircrafts} color="bg-blue-500" />
        <DashboardCard icon={<FaMapMarkerAlt />} label="Locations Covered" value={locations} color="bg-green-500" />
        <DashboardCard icon={<FaRoute />} label="Routes" value={routes} color="bg-purple-500" />
      </div>

      {/* Flight Stats Section */}
      <Section title="🛫 Active Flights">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard icon={<FaCalendarDay />} label="Today" value={flights.today} color="bg-yellow-500" />
          <DashboardCard icon={<FaCalendarWeek />} label="This Week" value={flights.week} color="bg-yellow-600" />
          <DashboardCard icon={<FaCalendarAlt />} label="This Month" value={flights.month} color="bg-yellow-700" />
        </div>
      </Section>

      {/* Cancelled Flights */}
      <Section title="❌ Cancelled Flights">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard icon={<FaCalendarDay />} label="Today" value={flights.cancelledToday} color="bg-red-500" />
          <DashboardCard icon={<FaCalendarWeek />} label="This Week" value={flights.cancelledWeek} color="bg-red-600" />
          <DashboardCard icon={<FaCalendarAlt />} label="This Month" value={flights.cancelledMonth} color="bg-red-700" />
        </div>
      </Section>

      {/* Delayed Flights */}
      <Section title="⏳ Delayed Flights">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard icon={<FaClock />} label="Today" value={flights.delayedToday} color="bg-orange-500" />
          <DashboardCard icon={<FaClock />} label="This Week" value={flights.delayedWeek} color="bg-orange-600" />
          <DashboardCard icon={<FaClock />} label="This Month" value={flights.delayedMonth} color="bg-orange-700" />
        </div>
      </Section>
    </div>
  );
};

export default Dashboard;

// 🔹 Reusable Card Component
const DashboardCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) => (
  <div className={`p-5 text-white rounded-lg shadow-md flex items-center gap-4 ${color}`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);


// 🔹 Reusable Section Wrapper
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mt-10">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
    {children}
  </div>
);
