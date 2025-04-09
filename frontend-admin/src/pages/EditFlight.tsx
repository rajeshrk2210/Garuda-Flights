import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const EditFlight = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState<any>(null);
  const [newDepartureDate, setNewDepartureDate] = useState("");
  const [newDepartureTime, setNewDepartureTime] = useState("");

  useEffect(() => {
    const fetchFlight = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/flights/${flightId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setFlight(data);
      setNewDepartureDate(data.departureDate);
      setNewDepartureTime(data.departureTime);
    };

    fetchFlight();
  }, [flightId]);

  const handleUpdate = async () => {
    const originalDateTime = new Date(`${flight.departureDate}T${flight.departureTime}:00`);
    const updatedDateTime = new Date(`${newDepartureDate}T${newDepartureTime}`);

    if (isNaN(updatedDateTime.getTime())) {
      alert("🚫 Please enter a valid date and time.");
      return;
    }

    if (updatedDateTime <= originalDateTime) {
      alert("🚫 New departure time must be later than current departure time.");
      return;
    }

    const updatedFlight = {
      departureDate: newDepartureDate,
      departureTime: newDepartureTime,
      status: "DELAYED",
    };

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/api/flights/${flightId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedFlight),
    });

    const result = await res.json();
    if (res.ok) {
      alert("✅ Flight updated successfully!");
      navigate("/admin"); // Redirect to Admin page
    } else {
      alert("❌ Error updating flight: " + result.message);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this flight?")) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/api/flights/${flightId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "CANCELLED" }),
    });

    const result = await res.json();
    if (res.ok) {
      alert("❌ Flight has been cancelled.");
      navigate("/admin"); // Redirect to Admin page
    } else {
      alert("❌ Error cancelling flight: " + result.message);
    }
  };

  if (!flight) return <p className="text-center text-gray-600">Loading...</p>;

  const isUpcoming = new Date(`${flight.departureDate}T${flight.departureTime}`) > new Date();
  const isEditable = isUpcoming && flight.status !== "CANCELLED";

  return (
    <div className="bg-white mt-10 rounded-xl shadow-sm p-6 border border-gray-200 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold text-teal-700 mb-6 text-center">✏️ Edit Flight</h2>

      {/* Flight Info */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <p className="mb-2 text-gray-800">
          <span className="font-medium">Aircraft:</span> {flight.aircraftNumber}
        </p>
        <p className="mb-2 text-gray-800">
          <span className="font-medium">Route:</span> {flight.route?.startLocation} → {flight.route?.endLocation}
        </p>
        <p className="mb-2 text-gray-800">
          <span className="font-medium">Status:</span> {flight.status}
        </p>
        <p className="mb-2 text-gray-800">
          <span className="font-medium">Current Departure:</span> {flight.departureDate} {flight.departureTime}
        </p>
        <p className="text-gray-800">
          <span className="font-medium">Arrival:</span> {flight.arrivalDate} {flight.arrivalTime}
        </p>
      </div>

      {/* Editable Form */}
      {isEditable ? (
        <>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-600">New Departure Date</label>
            <input
              type="date"
              value={newDepartureDate}
              onChange={(e) => setNewDepartureDate(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-600">New Departure Time</label>
            <input
              type="time"
              value={newDepartureTime}
              onChange={(e) => setNewDepartureTime(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleUpdate}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200"
            >
              Update Flight
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
            >
              Cancel Flight
            </button>
            <button
              onClick={() => navigate("/admin")}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Back to Admin
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mb-6 text-gray-600 italic text-center">
            This flight is either in the past or has been cancelled. No further changes are allowed.
          </p>
          <button
            onClick={() => navigate("/admin")}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Back to Admin
          </button>
        </>
      )}
    </div>
  );
};

export default EditFlight;