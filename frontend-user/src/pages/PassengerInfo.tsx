import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PassengerInfo = () => {
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState<any[]>([]);
  const [contactInfo, setContactInfo] = useState({
    contactPerson: "",
    country: "",
    mobile: "",
    email: "",
  });

  useEffect(() => {
    const selectedFlight = localStorage.getItem("selectedFlight");
    if (!selectedFlight) {
      navigate("/flights");
      return;
    }

    const flightData = JSON.parse(selectedFlight);
    const count = flightData.passengers || 1;
    const initialPassengers = Array.from({ length: count }, () => ({
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: "",
    }));

    setPassengers(initialPassengers);

    // Default to first passenger as contact person if available
    if (initialPassengers.length > 0) {
      const { firstName, lastName } = initialPassengers[0];
      if (firstName && lastName) {
        setContactInfo((prev) => ({
          ...prev,
          contactPerson: `${firstName} ${lastName}`,
        }));
      }
    }
  }, [navigate]);

  const handlePassengerChange = (index: number, field: string, value: string) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleSubmit = () => {
    for (const [i, p] of passengers.entries()) {
      if (!p.firstName || !p.lastName || !p.gender || !p.dateOfBirth) {
        alert(`❌ Please fill all fields for Passenger ${i + 1}`);
        return;
      }
    }

    if (!contactInfo.contactPerson || !contactInfo.country || !contactInfo.mobile || !contactInfo.email) {
      alert("❌ Please fill in all contact details.");
      return;
    }

    // Ensure contact person is one of the passengers
    const validContact = passengers.some(
      (p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().trim() ===
        contactInfo.contactPerson.toLowerCase().trim()
    );

    if (!validContact) {
      alert("❌ Contact Person must be one of the passengers.");
      return;
    }

    localStorage.setItem("passengerDetails", JSON.stringify({ passengers, contactInfo }));
    navigate("/review-booking");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">👤 Passenger Information</h2>

      {/* Passenger Fields */}
      {passengers.map((passenger, idx) => (
        <div key={idx} className="border border-gray-300 p-4 rounded mb-4 bg-gray-50">
          <h3 className="font-semibold text-lg mb-3 text-gray-700">Passenger {idx + 1}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={passenger.firstName}
              onChange={(e) => handlePassengerChange(idx, "firstName", e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={passenger.lastName}
              onChange={(e) => handlePassengerChange(idx, "lastName", e.target.value)}
              className="border p-2 rounded"
            />
            <select
              value={passenger.gender}
              onChange={(e) => handlePassengerChange(idx, "gender", e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="date"
              value={passenger.dateOfBirth}
              onChange={(e) => handlePassengerChange(idx, "dateOfBirth", e.target.value)}
              className="border p-2 rounded"
            />
          </div>
        </div>
      ))}

      {/* Contact Info */}
      <div className="mt-6 border border-gray-300 p-4 rounded bg-gray-50">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">📞 Contact Details</h3>
        <select
          value={contactInfo.contactPerson}
          onChange={(e) => setContactInfo({ ...contactInfo, contactPerson: e.target.value })}
          className="border p-2 rounded w-full mb-3"
        >
          <option value="">Select Contact Person</option>
          {passengers.map((p, idx) => {
            const fullName = `${p.firstName} ${p.lastName}`.trim();
            return (
              <option key={idx} value={fullName}>
                {fullName || `Passenger ${idx + 1}`}
              </option>
            );
          })}
        </select>
        <input
          type="text"
          placeholder="Country"
          value={contactInfo.country}
          onChange={(e) => setContactInfo({ ...contactInfo, country: e.target.value })}
          className="border p-2 rounded w-full mb-3"
        />
        <input
          type="tel"
          placeholder="Mobile Number"
          value={contactInfo.mobile}
          onChange={(e) => setContactInfo({ ...contactInfo, mobile: e.target.value })}
          className="border p-2 rounded w-full mb-3"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={contactInfo.email}
          onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
          className="border p-2 rounded w-full"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        ✅ Check Booking Details
      </button>
    </div>
  );
};

export default PassengerInfo;
