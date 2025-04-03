import AircraftManagement from "../components/admin/AircraftManagement";
import RouteManagement from "../components/admin/RouteManagement";
import FlightManagement from "../components/admin/FlightManagement";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">
          🛠️ Garuda Admin Panel
        </h2>

        {/* Aircraft Management Section */}
        <div className="mb-12 bg-white shadow-md rounded-lg p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
            ✈️ Aircraft Management
          </h3>
          <AircraftManagement />
        </div>

        {/* Route Management Section */}
        <div className="mb-12 bg-white shadow-md rounded-lg p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
            🗺️ Route Management
          </h3>
          <RouteManagement />
        </div>

        {/* Flight Management Section */}
        <div className="mb-12 bg-white shadow-md rounded-lg p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
            🛫 Flight Management
          </h3>
          <FlightManagement />
        </div>
      </div>
    </div>
  );
};

export default Admin;
