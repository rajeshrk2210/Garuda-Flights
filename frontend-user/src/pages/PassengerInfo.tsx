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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        {/* Header */}
        <h2 className="text-3xl font-bold text-teal-800 mb-8 text-center">
          👤 Passenger Information
        </h2>

        {/* Passenger Fields */}
        {passengers.map((passenger, idx) => (
          <div
            key={idx}
            className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-teal-700 mb-4">
              Passenger {idx + 1}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`firstName-${idx}`}
                  className="flex text-sm font-medium text-gray-700 mb-1"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id={`firstName-${idx}`}
                  placeholder="Enter first name"
                  value={passenger.firstName}
                  onChange={(e) => handlePassengerChange(idx, "firstName", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-gray-800"
                />
              </div>
              <div>
                <label
                  htmlFor={`lastName-${idx}`}
                  className="flex text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id={`lastName-${idx}`}
                  placeholder="Enter last name"
                  value={passenger.lastName}
                  onChange={(e) => handlePassengerChange(idx, "lastName", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-gray-800"
                />
              </div>
              <div>
                <label
                  htmlFor={`gender-${idx}`}
                  className="flex text-sm font-medium text-gray-700 mb-1"
                >
                  Gender *
                </label>
                <select
                  id={`gender-${idx}`}
                  value={passenger.gender}
                  onChange={(e) => handlePassengerChange(idx, "gender", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor={`dateOfBirth-${idx}`}
                  className="flex text-sm font-medium text-gray-700 mb-1"
                >
                  Date of Birth *
                </label>
                <input
                  type="date"
                  id={`dateOfBirth-${idx}`}
                  value={passenger.dateOfBirth}
                  onChange={(e) => handlePassengerChange(idx, "dateOfBirth", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Contact Info */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-teal-700 mb-4">📞 Contact Details</h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="contactPerson"
                className="flex text-sm font-medium text-gray-700 mb-1"
              >
                Contact Person *
              </label>
              <select
                id="contactPerson"
                value={contactInfo.contactPerson}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, contactPerson: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
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
            </div>
            <div>
              <label
                htmlFor="country"
                className="flex text-sm font-medium text-gray-700 mb-1"
              >
                Country *
              </label>
              <input
                type="text"
                id="country"
                placeholder="Enter country"
                value={contactInfo.country}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, country: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-gray-800"
              />
            </div>
            <div>
              <label
                htmlFor="mobile"
                className="flex text-sm font-medium text-gray-700 mb-1"
              >
                Mobile Number *
              </label>
              <input
                type="tel"
                id="mobile"
                placeholder="Enter mobile number"
                value={contactInfo.mobile}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, mobile: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-gray-800"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="flex text-sm font-medium text-gray-700 mb-1"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter email address"
                value={contactInfo.email}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-teal-700 text-white py-3 rounded-lg hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-500 transition duration-300 font-semibold shadow-md"
        >
          ✅ Check Booking Details
        </button>
      </div>
    </div>
  );
};

export default PassengerInfo;