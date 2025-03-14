import { useState, useEffect } from "react";

// Interfaces
interface Aircraft {
  aircraftNumber: string;
  aircraftModel: string;
  economySeats: number;
  premiumSeats: number;
}

// Predefined Aircraft Models
const aircraftModels = [
  "Boeing 737", "Boeing 747", "Boeing 777", "Boeing 787 Dreamliner",
  "Airbus A320", "Airbus A330", "Airbus A350", "Airbus A380",
  "Embraer E190", "Bombardier CRJ900"
];

const AircraftManagement = () => {
  const [newAircraft, setNewAircraft] = useState<Aircraft>({
    aircraftNumber: "",
    aircraftModel: "",
    economySeats: 0,
    premiumSeats: 0,
  });

  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [searchAircraftNumber, setSearchAircraftNumber] = useState("");
  const [searchAircraftModel, setSearchAircraftModel] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchAircrafts();
  }, []);

  /** 🔹 Fetch Aircrafts with Optional Search Filters */
  const fetchAircrafts = async () => {
    setIsSearching(true);
    setSearchError(null);
    setAircrafts([]); // Clear previous results before new search

    try {
      const queryParams = new URLSearchParams();
      if (searchAircraftNumber) queryParams.append("aircraftNumber", searchAircraftNumber);
      if (searchAircraftModel) queryParams.append("aircraftModel", searchAircraftModel);

      const response = await fetch(`http://localhost:5000/api/aircrafts?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`❌ API Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length === 0) {
        setSearchError("❌ No matching aircrafts found.");
      } else {
        setAircrafts(data);
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      setSearchError("❌ Failed to fetch aircrafts. Please try again later.");
    } finally {
      setIsSearching(false);
    }
  };


  /** 🔹 Add Aircraft */
  const addAircraft = async () => {
    if (!newAircraft.aircraftNumber || !newAircraft.aircraftModel || !newAircraft.economySeats || !newAircraft.premiumSeats) {
      alert("⚠️ All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/aircrafts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAircraft),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Aircraft added successfully!");
        setNewAircraft({ aircraftNumber: "", aircraftModel: "", economySeats: 0, premiumSeats: 0 });
        fetchAircrafts(); // Refresh aircraft list
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      alert("❌ Network Error: Failed to connect to backend.");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-lg mb-8">
      <h3 className="text-xl font-semibold mb-4">✈️ Aircraft Management</h3>

      {/* Add Aircraft */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h4 className="text-lg font-semibold mb-2">➕ Add Aircraft</h4>
        <input
          type="text"
          placeholder="Aircraft Number"
          className="border p-2 w-full mb-2"
          value={newAircraft.aircraftNumber}
          onChange={(e) => setNewAircraft({ ...newAircraft, aircraftNumber: e.target.value })}
        />
        <select
          className="border p-2 w-full mb-2"
          value={newAircraft.aircraftModel}
          onChange={(e) => setNewAircraft({ ...newAircraft, aircraftModel: e.target.value })}
        >
          <option value="">Select Model</option>
          {aircraftModels.map((model, index) => <option key={index} value={model}>{model}</option>)}
        </select>
        <input
          type="number"
          placeholder="Economy Seats"
          className="border p-2 w-full mb-2"
          value={newAircraft.economySeats || ""}
          onChange={(e) => setNewAircraft({ ...newAircraft, economySeats: Number(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Premium Seats"
          className="border p-2 w-full mb-2"
          value={newAircraft.premiumSeats || ""}
          onChange={(e) => setNewAircraft({ ...newAircraft, premiumSeats: Number(e.target.value) })}
        />
        <button onClick={addAircraft} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Aircraft
        </button>
      </div>

      {/* Search Aircrafts */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h4 className="text-lg font-semibold mb-2">🔍 Search Aircrafts</h4>
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search by Aircraft Number"
            className="border p-2 flex-1"
            value={searchAircraftNumber}
            onChange={(e) => setSearchAircraftNumber(e.target.value)}
          />
          <select
            className="border p-2 flex-1"
            value={searchAircraftModel}
            onChange={(e) => setSearchAircraftModel(e.target.value)}
          >
            <option value="">All Models</option>
            {aircraftModels.map((model, index) => (
              <option key={index} value={model}>{model}</option>
            ))}
          </select>
          <button onClick={fetchAircrafts} className="bg-green-500 text-white px-4 py-2 rounded">
            Search
          </button>
        </div>
      </div>

      {/* Aircraft List */}
      <h4 className="text-lg font-semibold mt-4">Aircraft List</h4>
      {isSearching ? (
        <p className="text-blue-500 mt-2">🔄 Searching...</p>
      ) : searchError ? (
        <p className="text-red-500 mt-2">{searchError}</p>
      ) : aircrafts.length === 0 ? (
        <p className="text-gray-600 mt-2">No aircrafts found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Aircraft Number</th>
              <th className="border p-2">Model</th>
              <th className="border p-2">Economy Seats</th>
              <th className="border p-2">Premium Seats</th>
            </tr>
          </thead>
          <tbody>
            {aircrafts.map((aircraft: Aircraft, index) => (
              <tr key={index} className="border">
                <td className="border p-2">{aircraft.aircraftNumber}</td>
                <td className="border p-2">{aircraft.aircraftModel}</td>
                <td className="border p-2">{aircraft.economySeats}</td>
                <td className="border p-2">{aircraft.premiumSeats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
};

export default AircraftManagement;
