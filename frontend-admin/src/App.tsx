import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import EditFlight from "./pages/EditFlight";
import AircraftManagement from "./components/admin/AircraftManagement";
import RouteManagement from "./components/admin/RouteManagement";
import FlightManagement from "./components/admin/FlightManagement";

const App = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { admin } = authContext;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <main className={`flex-grow ${admin ? "ml-72" : ""}`}>
          <Routes>
            {/* Root path: redirect to /dashboard if logged in, /login if not */}
            <Route
              path="/"
              element={<Navigate to={admin ? "/dashboard" : "/login"} />}
            />

            {/* Login: redirect to /dashboard if already logged in */}
            <Route
              path="/login"
              element={admin ? <Navigate to="/dashboard" /> : <Login />}
            />

            {/* Signup: redirect to /dashboard if already logged in */}
            <Route
              path="/signup"
              element={admin ? <Navigate to="/dashboard" /> : <Signup />}
            />

            {/* Protected routes: redirect to /login if not logged in */}
            <Route
              path="/dashboard"
              element={admin ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin/aircraft"
              element={admin ? <AircraftManagement /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin/routes"
              element={admin ? <RouteManagement /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin/flights"
              element={admin ? <FlightManagement /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={admin ? <Profile /> : <Navigate to="/login" />}
            />
            <Route
              path="/flights/:flightId"
              element={admin ? <EditFlight /> : <Navigate to="/login" />}
            />

            <Route
              path="*"
              element={<Navigate to={admin ? "/dashboard" : "/login"} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;