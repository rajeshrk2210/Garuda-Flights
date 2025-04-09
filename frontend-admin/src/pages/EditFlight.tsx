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
      navigate("/admin"); // ✅ Redirect to Admin page
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
        Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: "CANCELLED" }),
    });

    const result = await res.json();
    if (res.ok) {
      alert("❌ Flight has been cancelled.");
      navigate("/admin"); // ✅ Redirect to Admin page
    } else {
      alert("❌ Error cancelling flight: " + result.message);
    }
  };

  if (!flight) return <p>Loading...</p>;

  const isUpcoming = new Date(`${flight.departureDate}T${flight.departureTime}`) > new Date();
  const isEditable = isUpcoming && flight.status !== "CANCELLED";

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">✏️ Edit Flight</h2>
  
      {/* Flight Info */}
      <div className="bg-gray-100 p-4 rounded mb-6 text-gray-800">
        <p className="mb-1"><span className="font-semibold">Aircraft:</span> {flight.aircraftNumber}</p>
        <p className="mb-1">
          <span className="font-semibold">Route:</span> {flight.route?.startLocation} → {flight.route?.endLocation}
        </p>
        <p className="mb-1"><span className="font-semibold">Status:</span> {flight.status}</p>
        <p className="mb-1"><span className="font-semibold">Current Departure:</span> {flight.departureDate} {flight.departureTime}</p>
        <p><span className="font-semibold">Arrival:</span> {flight.arrivalDate} {flight.arrivalTime}</p>
      </div>
  
      {/* Editable Form */}
      {isEditable ? (
        <>
          <label className="block mb-1 text-sm text-gray-700">New Departure Date</label>
          <input
            type="date"
            value={newDepartureDate}
            onChange={(e) => setNewDepartureDate(e.target.value)}
            className="border p-2 w-full mb-4 rounded bg-white text-gray-800"
          />
  
          <label className="block mb-1 text-sm text-gray-700">New Departure Time</label>
          <input
            type="time"
            value={newDepartureTime}
            onChange={(e) => setNewDepartureTime(e.target.value)}
            className="border p-2 w-full mb-4 rounded bg-white text-gray-800"
          />
  
          <div className="mt-4 flex flex-wrap gap-4">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
            >
              Update Flight
            </button>
            <button
              onClick={handleCancel}
              className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
            >
              Cancel Flight
            </button>
            <button
              onClick={() => navigate("/admin")}
              className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600 transition"
            >
              Back to Admin Page
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-6 text-gray-600 italic">
            This flight is either in the past or has been cancelled. No further changes are allowed.
          </p>
          <button
            onClick={() => navigate("/admin")}
            className="mt-6 bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600 transition"
          >
            Back to Admin Page
          </button>
        </>
      )}
    </div>
  );  
};

export default EditFlight;
