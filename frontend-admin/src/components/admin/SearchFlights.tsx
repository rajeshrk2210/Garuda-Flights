import { useState } from "react";

interface Flight {
  _id: string;
  aircraftNumber: string;
  route: { startLocation: string; endLocation: string };
  departureDate: string;
  departureTime: string;
  status: "OK" | "DELAYED" | "CANCELLED";
}

const SearchFlights = () => {
  const [searchParams, setSearchParams] = useState({
    aircraftNumber: "",
    startLocation: "",
    endLocation: "",
    type: "All",
  });

  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  /** 🔍 Fetch Flights */
  const fetchFlights = async () => {
    setIsSearching(true);
    setSearchError(null);
    setFlights([]);

    try {
      const queryParams = new URLSearchParams();
      if (searchParams.aircraftNumber) queryParams.append("aircraftNumber", searchParams.aircraftNumber);
      if (searchParams.startLocation) queryParams.append("startLocation", searchParams.startLocation);
      if (searchParams.endLocation) queryParams.append("endLocation", searchParams.endLocation);

      const response = await fetch(`http://localhost:5000/api/flights?${queryParams.toString()}`);
      if (!response.ok) throw new Error("❌ Error fetching flights.");

      const data = await response.json();
      if (data.length === 0) {
        setSearchError("❌ No matching flights found.");
      } else {
        setFlights(data);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setSearchError("❌ Failed to fetch flights.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-lg mt-8">
      <h3 className="text-xl font-semibold mb-4">🔍 Search Flights</h3>

      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Aircraft Number"
          className="border p-2 w-full"
          value={searchParams.aircraftNumber}
          onChange={(e) => setSearchParams({ ...searchParams, aircraftNumber: e.target.value })}
        />
        <input
          type="text"
          placeholder="Start Location"
          className="border p-2 w-full"
          value={searchParams.startLocation}
          onChange={(e) => setSearchParams({ ...searchParams, startLocation: e.target.value })}
        />
        <input
          type="text"
          placeholder="End Location"
          className="border p-2 w-full"
          value={searchParams.endLocation}
          onChange={(e) => setSearchParams({ ...searchParams, endLocation: e.target.value })}
        />
        <select
          className="border p-2 w-full"
          value={searchParams.type}
          onChange={(e) => setSearchParams({ ...searchParams, type: e.target.value })}
        >
          <option value="All">All</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Previous">Previous</option>
        </select>
        <button onClick={fetchFlights} className="bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      {isSearching ? (
        <p className="text-blue-500">🔄 Searching...</p>
      ) : searchError ? (
        <p className="text-red-500">{searchError}</p>
      ) : flights.length === 0 ? (
        <p className="text-gray-600">No flights found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Aircraft</th>
              <th className="border p-2">Start Location</th>
              <th className="border p-2">End Location</th>
              <th className="border p-2">Departure Date</th>
              <th className="border p-2">Departure Time</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight._id} className="border">
                <td className="border p-2">{flight.aircraftNumber}</td>
                <td className="border p-2">{flight.route.startLocation}</td>
                <td className="border p-2">{flight.route.endLocation}</td>
                <td className="border p-2">{flight.departureDate}</td>
                <td className="border p-2">{flight.departureTime}</td>
                <td className="border p-2">{flight.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchFlights;
