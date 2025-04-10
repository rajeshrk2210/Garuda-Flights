import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatTime } from "../utils/formatTime";
import apiURL from "../config/config";

// Define the Flight interface based on expected API response
interface Flight {
  _id: string;
  aircraftNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
}

const Flights = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tripType, setTripType] = useState<"oneway" | "roundtrip">("oneway");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [flightClass, setFlightClass] = useState<"Economy" | "Premium">("Economy");
  const [locations, setLocations] = useState<string[]>([]);
  const [outboundFlights, setOutboundFlights] = useState<Flight[]>([]); // Typed as Flight[]
  const [inboundFlights, setInboundFlights] = useState<Flight[]>([]);   // Typed as Flight[]

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${apiURL}/api/routes/locations`);
        const data = await res.json();
        setLocations(data);
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };
    fetchLocations();
  }, []);

  const searchFlights = async () => {
    localStorage.removeItem("selectedFlight");
    if (!startLocation || !endLocation || !departureDate) {
      alert("Please fill required fields");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const query = `start=${startLocation}&end=${endLocation}&date=${departureDate}&class=${flightClass}`;
      const res = await fetch(`${apiURL}/api/flights/search?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOutboundFlights(data);

      if (tripType === "roundtrip" && returnDate) {
        const returnQuery = `start=${endLocation}&end=${startLocation}&date=${returnDate}&class=${flightClass}`;
        const returnRes = await fetch(`${apiURL}/api/flights/search?${returnQuery}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const returnData = await returnRes.json();
        setInboundFlights(returnData);
      } else {
        setInboundFlights([]);
      }
    } catch (err) {
      console.error("Error searching flights:", err);
    }
  };

  // Calculate arrival time with typed parameters
  const calculateArrival = (departureDate: string, departureTime: string, duration: string) => {
    const [year, month, day] = departureDate.split("-").map(Number);
    const [depH, depM] = departureTime.split(":").map(Number);
    const [durH, durM] = duration.split(":").map(Number);

    const depDateTime = new Date(year, month - 1, day, depH, depM);
    depDateTime.setHours(depDateTime.getHours() + durH);
    depDateTime.setMinutes(depDateTime.getMinutes() + durM);

    return {
      arrivalDate: depDateTime.toISOString().split("T")[0],
      arrivalTime: depDateTime.toTimeString().slice(0, 5),
    };
  };

  // Handle flight selection with typed parameters
  const handleSelectFlight = (flight: Flight, type: "outbound" | "inbound") => {
    const existing = JSON.parse(localStorage.getItem("selectedFlight") || "{}");
    const selectedDate = type === "outbound" ? departureDate : returnDate;
    const { arrivalDate, arrivalTime } = calculateArrival(selectedDate, flight.departureTime, flight.duration);

    const updatedFlight = {
      ...flight,
      departureDate: selectedDate,
      arrivalDate,
      arrivalTime,
    };

    const updatedSelection = {
      tripType,
      passengers,
      flightClass,
      from: startLocation,
      to: endLocation,
      selectedOutbound: type === "outbound" ? updatedFlight : existing.selectedOutbound,
      selectedInbound: type === "inbound" ? updatedFlight : existing.selectedInbound,
    };

    localStorage.setItem("selectedFlight", JSON.stringify(updatedSelection));

    if (tripType === "oneway" || (tripType === "roundtrip" && type === "inbound")) {
      navigate("/review-flight");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl font-bold text-teal-800 mb-8 text-center">Search Your Flights</h2>

        {/* Flight Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10 border border-gray-200">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="tripType" className="flex text-sm font-medium text-gray-700 mb-1">
                Trip Type
              </label>
              <select
                id="tripType"
                value={tripType}
                onChange={(e) => setTripType(e.target.value as "oneway" | "roundtrip")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
              >
                <option value="oneway">One Way</option>
                <option value="roundtrip">Round Trip</option>
              </select>
            </div>

            <div>
              <label htmlFor="startLocation" className="flex text-sm font-medium text-gray-700 mb-1">
                From *
              </label>
              <select
                id="startLocation"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
              >
                <option value="">Select Departure</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="endLocation" className="flex text-sm font-medium text-gray-700 mb-1">
                To *
              </label>
              <select
                id="endLocation"
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
              >
                <option value="">Select Destination</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="departureDate" className="flex text-sm font-medium text-gray-700 mb-1">
                Departure Date *
              </label>
              <input
                type="date"
                id="departureDate"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
              />
            </div>

            {tripType === "roundtrip" && (
              <div>
                <label htmlFor="returnDate" className="flex text-sm font-medium text-gray-700 mb-1">
                  Return Date
                </label>
                <input
                  type="date"
                  id="returnDate"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
                />
              </div>
            )}

            <div>
              <label htmlFor="passengers" className="flex text-sm font-medium text-gray-700 mb-1">
                Passengers
              </label>
              <select
                id="passengers"
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} Passenger{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="flightClass" className="flex text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                id="flightClass"
                value={flightClass}
                onChange={(e) => setFlightClass(e.target.value as "Economy" | "Premium")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
              >
                <option value="Economy">Economy</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            <button
              onClick={searchFlights}
              className="sm:col-span-2 lg:col-span-3 bg-teal-700 text-white py-3 rounded-lg hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-500 transition duration-300 font-semibold shadow-md"
            >
              Search Flights
            </button>
          </div>
        </div>

        {/* Outbound Flights */}
        {outboundFlights.length > 0 ? (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-teal-700 mb-6">
              Outbound Flights
            </h3>
            <div className="space-y-6">
              {outboundFlights.map((flight) => (
                <div
                  key={flight._id}
                  className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 hover:shadow-lg transition duration-300"
                >
                  <div className="flex items-center">
                    <div>
                      <p className="text-sm text-left text-gray-500">Aircraft No. {flight.aircraftNumber}</p>

                      <div className="flex items-center gap-4 mt-2">
                        <div className="text-left">
                          <p className="text-lg font-semibold text-gray-800">
                            {startLocation}
                          </p>
                          <p className="text-sm text-gray-500">{formatTime(flight.departureTime)}</p>
                        </div>

                        <div className="flex-1 border-t border-dashed border-gray-300"></div>

                        <div className="text-left">
                          <p className="text-lg font-semibold text-gray-800">
                            {endLocation}
                          </p>
                          <p className="text-sm text-gray-500">{formatTime(flight.arrivalTime)}</p>
                        </div>
                      </div>

                      <p className="mt-2 text-left text-sm text-gray-500">
                        Duration: {flight.duration} Hrs
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-teal-700 text-nowrap">CAD {flight.price}</p>
                      <button
                        onClick={() => handleSelectFlight(flight, "outbound")}
                        className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">No Outbound Flights Found</p>
        )}


        {/* Inbound Flights */}
        {tripType === "roundtrip" && (
          inboundFlights.length > 0 ? (
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-teal-700 mb-6">
                Inbound Flights
              </h3>
              <div className="space-y-6">
                {inboundFlights.map((flight) => (
                  <div
                    key={flight._id}
                    className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 hover:shadow-lg transition duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-left text-gray-500">
                          Aircraft No. {flight.aircraftNumber}
                        </p>

                        <div className="flex items-center gap-4 mt-2">
                          <div className="text-left">
                            <p className="text-lg font-semibold text-gray-800">
                              {endLocation}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatTime(flight.departureTime)}
                            </p>
                          </div>

                          <div className="flex-1 border-t border-dashed border-gray-300"></div>

                          <div className="text-left">
                            <p className="text-lg font-semibold text-gray-800">
                              {startLocation}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatTime(flight.arrivalTime)}
                            </p>
                          </div>
                        </div>

                        <p className="mt-2 text-left text-sm text-gray-500">
                          Duration: {flight.duration} Hrs
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-teal-700 text-nowrap">
                          CAD {flight.price}
                        </p>
                        <button
                          onClick={() => handleSelectFlight(flight, "inbound")}
                          className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-6">
              No Inbound Flights Found
            </p>
          )
        )}

      </div>
    </div>
  );
};

export default Flights;