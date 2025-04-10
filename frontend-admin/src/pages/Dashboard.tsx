import React from "react";
import { useEffect, useState } from "react";
import {
  FaPlane,
  FaMapMarkerAlt,
  FaRoute,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import apiURL from "../config/config";

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
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const token = localStorage.getItem("token");

        const [aircraftRes, locationsRes, routesRes, flightsRes] = await Promise.all([
          fetch(`${apiURL}/api/aircrafts/count`),
          fetch(`${apiURL}/api/routes/locations`),
          fetch(`${apiURL}/api/routes/count`),
          fetch(`${apiURL}/api/flights/stats`, {
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
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <h1 className="text-3xl font-bold text-teal-700 mb-8 text-center">
        ✈️ Garuda Admin Dashboard
      </h1>

      {/* Overview Section */}
      {loading ? (
        <SkeletonLoader count={3} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            icon={<FaPlane />}
            label="Total Aircrafts"
            value={aircrafts}
            accentColor="bg-teal-100 text-teal-700"
          />
          <DashboardCard
            icon={<FaMapMarkerAlt />}
            label="Locations Covered"
            value={locations}
            accentColor="bg-cyan-100 text-cyan-700"
          />
          <DashboardCard
            icon={<FaRoute />}
            label="Routes"
            value={routes}
            accentColor="bg-amber-100 text-amber-700"
          />
        </div>
      )}

      {/* Flight Stats Section */}
      <Section title="🛫 Active Flights">
        {loading ? (
          <SkeletonLoader count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
              icon={<FaCalendarDay />}
              label="Today"
              value={flights.today}
              accentColor="bg-teal-100 text-teal-700"
            />
            <DashboardCard
              icon={<FaCalendarWeek />}
              label="This Week"
              value={flights.week}
              accentColor="bg-teal-100 text-teal-700"
            />
            <DashboardCard
              icon={<FaCalendarAlt />}
              label="This Month"
              value={flights.month}
              accentColor="bg-teal-100 text-teal-700"
            />
          </div>
        )}
      </Section>

      {/* Cancelled Flights */}
      <Section title="❌ Cancelled Flights">
        {loading ? (
          <SkeletonLoader count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
              icon={<FaCalendarDay />}
              label="Today"
              value={flights.cancelledToday}
              accentColor="bg-red-100 text-red-700"
            />
            <DashboardCard
              icon={<FaCalendarWeek />}
              label="This Week"
              value={flights.cancelledWeek}
              accentColor="bg-red-100 text-red-700"
            />
            <DashboardCard
              icon={<FaCalendarAlt />}
              label="This Month"
              value={flights.cancelledMonth}
              accentColor="bg-red-100 text-red-700"
            />
          </div>
        )}
      </Section>

      {/* Delayed Flights */}
      <Section title="⏳ Delayed Flights">
        {loading ? (
          <SkeletonLoader count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
              icon={<FaClock />}
              label="Today"
              value={flights.delayedToday}
              accentColor="bg-orange-100 text-orange-700"
            />
            <DashboardCard
              icon={<FaClock />}
              label="This Week"
              value={flights.delayedWeek}
              accentColor="bg-orange-100 text-orange-700"
            />
            <DashboardCard
              icon={<FaClock />}
              label="This Month"
              value={flights.delayedMonth}
              accentColor="bg-orange-100 text-orange-700"
            />
          </div>
        )}
      </Section>
    </div>
  );
};

// 🔹 Skeleton Loader Component
const SkeletonLoader = ({ count }: { count: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 flex items-center gap-4 animate-pulse"
      >
        <div className="p-3 rounded-full bg-gray-200 h-12 w-12"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

// 🔹 Reusable Card Component
const DashboardCard = ({
  icon,
  label,
  value,
  accentColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accentColor: string;
}) => (
  <div
    className={`bg-white rounded-xl shadow-sm p-6 hover:bg-gray-50 transition duration-200 border border-gray-200 flex items-center gap-4`}
  >
    <div className={`p-3 rounded-full ${accentColor}`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// 🔹 Reusable Section Wrapper
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mt-10">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
    {children}
  </div>
);

export default Dashboard;