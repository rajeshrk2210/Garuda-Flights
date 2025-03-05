import AircraftManagement from "../components/admin/AircraftManagement";
import RouteManagement from "../components/admin/RouteManagement";
// import FlightManagement from "../components/admin/FlightManagement";

const Admin = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Admin Panel</h2>

      {/* Aircraft Management Section */}
      <AircraftManagement />

      {/* Route Management Section */}
      <RouteManagement />

      {/* Flight Management Section */}
      {/* <FlightManagement /> */}
    </div>
  );
};

export default Admin;
