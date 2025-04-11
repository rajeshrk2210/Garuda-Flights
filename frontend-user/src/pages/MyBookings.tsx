import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import apiURL from "../config/config";

interface Booking {
  _id: string;
  pnr: string;
  status: string;
  seatClass: "Economy" | "Premium";
  price: number;
  createdAt: string;
  passengers: any[];
  contactDetails: any;
  flights: any[];
  seatAssignments: {
    flight: string;
    seatNumbers: string[];
  }[];
}

type FilterType = "ALL" | "UPCOMING" | "PREVIOUS" | "CANCELLED";

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("ALL");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchBookings = () => {
      const token = localStorage.getItem("token");
      fetch(`${apiURL}/api/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setBookings(data))
        .catch((err) => console.error("❌ Error fetching bookings:", err));
    };

    fetchBookings();
  }, [user, navigate]);

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiURL}/api/bookings/cancel/${bookingId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("✅ Booking cancelled.");
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: "CANCELLED" } : b
          )
        );
      } else {
        const data = await res.json();
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("❌ Error cancelling booking:", err);
      alert("Error cancelling booking.");
    }
  };

  const handleDownloadPDF = (booking: Booking) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Flight Ticket", 14, 22);

    doc.setFontSize(12);
    doc.text(`PNR: ${booking.pnr}`, 14, 30);
    doc.text(`Status: ${booking.status}`, 14, 36);
    doc.text(`Class: ${booking.seatClass}`, 14, 42);
    doc.text(`Price: ₹${booking.price}`, 14, 48);

    autoTable(doc, {
      startY: 55,
      head: [["Flight", "From", "To", "Departure", "Arrival", "Seats"]],
      body: booking.flights.map((flight) => {
        const seats = booking.seatAssignments.find((a) => a.flight === flight._id)?.seatNumbers.join(", ") || "N/A";
        return [
          flight.aircraftNumber,
          flight.route?.startLocation || "N/A",
          flight.route?.endLocation || "N/A",
          `${flight.departureDate} ${flight.departureTime}`,
          `${flight.arrivalDate} ${flight.arrivalTime}`,
          seats,
        ];
      }),
    });

    if (booking.passengers.length > 0) {
      const lastY = (doc as any).lastAutoTable?.finalY || 55; // Fallback to 55 if undefined
      doc.text("Passengers", 14, lastY + 10);
      autoTable(doc, {
        startY: lastY + 14,
        head: [["Name", "Gender", "DOB"]],
        body: booking.passengers.map((p) => [
          `${p.firstName} ${p.lastName}`,
          p.gender,
          p.dateOfBirth,
        ]),
      });
    }

    doc.save(`ticket-${booking.pnr}.pdf`);
  };

  const isUpcoming = (booking: Booking) =>
    booking.flights.some((f) => new Date(`${f.departureDate}T${f.departureTime}`) > new Date());

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "ALL") return true;
    if (filter === "CANCELLED") return booking.status === "CANCELLED";
    if (filter === "UPCOMING") return booking.status === "CONFIRMED" && isUpcoming(booking);
    if (filter === "PREVIOUS") return booking.status === "CONFIRMED" && !isUpcoming(booking);
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-teal-700">📄 My Bookings</h2>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-4">
        {["ALL", "UPCOMING", "PREVIOUS", "CANCELLED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as FilterType)}
            className={`px-4 py-2 rounded ${
              filter === f ? "bg-teal-700 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="border rounded p-4 bg-white shadow">
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
              <p><strong>Booking Date:</strong> {new Date(booking.createdAt).toLocaleString()}</p>

              {/* Minimal View */}
              {booking.flights.map((flight, idx) => (
                <div key={flight._id} className="mt-3 text-sm text-gray-700">
                  <p><strong>Flight:</strong> {flight.aircraftNumber} — {flight.route?.startLocation} to {flight.route?.endLocation}</p>
                </div>
              ))}

              {/* Expandable Ticket */}
              {expanded === booking._id && (
                <div className="mt-4 space-y-4">
                  {booking.flights.map((flight) => {
                    const seats = booking.seatAssignments.find(a => a.flight === flight._id)?.seatNumbers.join(", ") || "N/A";
                    return (
                      <div key={flight._id} className="bg-gray-50 p-4 rounded border">
                        <p><strong>From:</strong> {flight.route?.startLocation}</p>
                        <p><strong>To:</strong> {flight.route?.endLocation}</p>
                        <p><strong>Departure:</strong> {flight.departureDate} at {flight.departureTime}</p>
                        <p><strong>Arrival:</strong> {flight.arrivalDate} at {flight.arrivalTime}</p>
                        <p><strong>Seats:</strong> {seats}</p>
                      </div>
                    );
                  })}
                  <div>
                    <h4 className="font-semibold mt-4">👤 Passengers:</h4>
                    <ul className="list-disc ml-6 mt-2 text-sm">
                      {booking.passengers.map((p, i) => (
                        <li key={i}>{p.firstName} {p.lastName} | {p.gender} | DOB: {p.dateOfBirth}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-4 flex-wrap">
                <button
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                  onClick={() => setExpanded(expanded === booking._id ? null : booking._id)}
                >
                  {expanded === booking._id ? "Hide Ticket" : "View Ticket"}
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => handleDownloadPDF(booking)}
                >
                  Download Ticket
                </button>
                {booking.status === "CONFIRMED" && (
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={() => handleCancel(booking._id)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
