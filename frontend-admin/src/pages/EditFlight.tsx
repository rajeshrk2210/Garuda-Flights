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
    const originalDateTime = new Date(`${flight.departureDate}T${flight.departureTime}`);
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
    <div className="p-6 bg-white shadow rounded max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">✏️ Edit Flight</h2>

      <p><strong>Aircraft:</strong> {flight.aircraftNumber}</p>
      <p><strong>Route:</strong> {flight.route?.startLocation} → {flight.route?.endLocation}</p>
      <p><strong>Status:</strong> {flight.status}</p>
      <p><strong>Current Departure:</strong> {flight.departureDate} {flight.departureTime}</p>
      <p><strong>Arrival:</strong> {flight.arrivalDate} {flight.arrivalTime}</p>

      {isEditable ? (
        <>
          <label className="block mt-4">New Departure Date:</label>
          <input
            type="date"
            value={newDepartureDate}
            onChange={(e) => setNewDepartureDate(e.target.value)}
            className="border p-2 w-full"
          />

          <label className="block mt-2">New Departure Time:</label>
          <input
            type="time"
            value={newDepartureTime}
            onChange={(e) => setNewDepartureTime(e.target.value)}
            className="border p-2 w-full"
          />

          <div className="mt-4 flex flex-wrap gap-4">
            <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">
              Update Flight
            </button>
            <button onClick={handleCancel} className="bg-red-600 text-white px-4 py-2 rounded">
              Cancel Flight
            </button>
            <button onClick={() => navigate("/admin")} className="bg-gray-500 text-white px-4 py-2 rounded">
              Back to Admin Page
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-6 text-gray-600 italic">
            This flight is either in the past or has been cancelled. No further changes are allowed.
          </p>
          <button onClick={() => navigate("/admin")} className="mt-6 bg-gray-500 text-white px-4 py-2 rounded">
            Back to Admin Page
          </button>
        </>
      )}
    </div>
  );
};

export default EditFlight;
