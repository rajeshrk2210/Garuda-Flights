import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Booking {
  _id: string;
  pnr: string;
  status: string;
  seatClass: "Economy" | "Premium";
  price: number;
  createdAt: string;
  flights: any[]; // populated from backend
  seatAssignments: {
    flight: string;
    seatNumbers: string[];
  }[];
}

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/bookings/my-bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("❌ Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  const handleCancel = async (bookingId: string) => {
    const confirm = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/bookings/cancel/${bookingId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Booking cancelled.");
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: "CANCELLED" } : b))
        );
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("❌ Error cancelling booking:", err);
      alert("Error cancelling booking.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">📄 My Bookings</h2>
      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-600">You have no bookings yet.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border rounded p-4 bg-white shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-semibold">PNR: {booking.pnr}</p>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded ${
                    booking.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <p><strong>Class:</strong> {booking.seatClass}</p>
              <p><strong>Total Price:</strong> ₹{booking.price}</p>
              <p><strong>Booking Date:</strong> {new Date(booking.createdAt).toLocaleString()}</p>

              <div className="mt-3">
                <h4 className="font-semibold">Flights:</h4>
                {booking.flights.map((flight, idx) => (
                  <div key={flight._id} className="border p-3 mt-2 rounded bg-gray-50">
                    <p><strong>Aircraft No:</strong> {flight.aircraftNumber}</p>
                    <p><strong>From:</strong> {flight.route?.startLocation}</p>
                    <p><strong>To:</strong> {flight.route?.endLocation}</p>
                    <p><strong>Departure:</strong> {flight.departureDate} at {flight.departureTime}</p>
                    <p><strong>Arrival:</strong> {flight.arrivalDate} at {flight.arrivalTime}</p>
                    <p>
                      <strong>Seats:</strong>{" "}
                      {
                        booking.seatAssignments.find(a => a.flight === flight._id)?.seatNumbers.join(", ") || "N/A"
                      }
                    </p>
                  </div>
                ))}
              </div>

              {booking.status === "CONFIRMED" && (
                <button
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  onClick={() => handleCancel(booking._id)}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
