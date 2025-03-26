import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Flights = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Search Flights</h1>
      {/* Flights search UI to be implemented next */}
    </div>
  );
};

export default Flights;
