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
            if (!token) {
                alert("No token found. Please log in again.");
                navigate("/login");
                return;
            }
            const res = await fetch(`http://localhost:5000/api/flights/${flightId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setFlight(data);
            setNewDepartureDate(data.departureDate); // setNewDepartureDate(data.departureDate.split("T")[0]);
            setNewDepartureTime(data.departureTime);
        };

        fetchFlight();
    }, [flightId]);

    const handleUpdate = async () => {
        const originalDateTime = new Date(`${flight.departureDate}T${flight.departureTime}`);
        const updatedDateTime = new Date(`${newDepartureDate}T${newDepartureTime}`);

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
        if (!token) {
            alert("No token found. Please log in again.");
            navigate("/login");
            return;
        }


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
            navigate("/dashboard");
        } else {
            alert("❌ Error updating flight: " + result.message);
        }
    };

    if (!flight) return <p>Loading...</p>;

    return (
        <div className="p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4">✏️ Edit Flight</h2>

            <p><strong>Aircraft:</strong> {flight.aircraftNumber}</p>
            <p><strong>Route:</strong> {flight.route?.startLocation} → {flight.route?.endLocation}</p>

            <label className="block mt-4">New Departure Date:</label>
            <input type="date" value={newDepartureDate} onChange={(e) => setNewDepartureDate(e.target.value)} className="border p-2 w-full" />

            <label className="block mt-2">New Departure Time:</label>
            <input type="time" value={newDepartureTime} onChange={(e) => setNewDepartureTime(e.target.value)} className="border p-2 w-full" />

            <button onClick={handleUpdate} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Update Flight</button>
        </div>
    );
};

export default EditFlight;
