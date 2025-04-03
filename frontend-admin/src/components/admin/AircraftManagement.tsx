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

  const fetchAircrafts = async () => {
    setIsSearching(true);
    setSearchError(null);
    setAircrafts([]);

    try {
      const queryParams = new URLSearchParams();
      if (searchAircraftNumber) queryParams.append("aircraftNumber", searchAircraftNumber);
      if (searchAircraftModel) queryParams.append("aircraftModel", searchAircraftModel);

      const response = await fetch(`http://localhost:5000/api/aircrafts?${queryParams.toString()}`);
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

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
        fetchAircrafts();
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      alert("❌ Network Error: Failed to connect to backend.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-10">
      <h3 className="text-2xl font-bold text-blue-700 mb-6">✈️ Aircraft Management</h3>

      {/* Add Aircraft */}
      <div className="mb-6 p-4 border rounded bg-white shadow">
        <h4 className="text-lg font-semibold mb-4 text-blue-700">➕ Add Aircraft</h4>

        <input
          type="text"
          placeholder="Aircraft Number"
          className="border border-gray-300 bg-white text-gray-800 placeholder-gray-600 p-2 rounded w-full mb-3"
          value={newAircraft.aircraftNumber}
          onChange={(e) => setNewAircraft({ ...newAircraft, aircraftNumber: e.target.value })}
        />

        <select
          className="border border-gray-300 bg-white text-gray-800 p-2 rounded w-full mb-3"
          value={newAircraft.aircraftModel}
          onChange={(e) => setNewAircraft({ ...newAircraft, aircraftModel: e.target.value })}
        >
          <option value="">Select Model</option>
          {aircraftModels.map((model, index) => <option key={index} value={model}>{model}</option>)}
        </select>

        <input
          type="number"
          placeholder="Economy Seats"
          className="border border-gray-300 bg-white text-gray-800 placeholder-gray-600 p-2 rounded w-full mb-3"
          value={newAircraft.economySeats || ""}
          onChange={(e) => setNewAircraft({ ...newAircraft, economySeats: Number(e.target.value) })}
        />

        <input
          type="number"
          placeholder="Premium Seats"
          className="border border-gray-300 bg-white text-gray-800 placeholder-gray-600 p-2 rounded w-full mb-4"
          value={newAircraft.premiumSeats || ""}
          onChange={(e) => setNewAircraft({ ...newAircraft, premiumSeats: Number(e.target.value) })}
        />

        <button onClick={addAircraft} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Add Aircraft
        </button>
      </div>

      {/* Search Aircrafts */}
      <div className="bg-white border p-4 rounded shadow mb-8">
        <h4 className="text-lg font-semibold mb-4 text-blue-700">🔍 Search Aircrafts</h4>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by Aircraft Number"
            className="border border-gray-300 bg-white text-gray-800 placeholder-gray-600 p-2 rounded flex-1"
            value={searchAircraftNumber}
            onChange={(e) => setSearchAircraftNumber(e.target.value)}
          />
          <select
            className="border border-gray-300 bg-white text-gray-800 p-2 rounded flex-1"
            value={searchAircraftModel}
            onChange={(e) => setSearchAircraftModel(e.target.value)}
          >
            <option value="">All Models</option>
            {aircraftModels.map((model, index) => (
              <option key={index} value={model}>{model}</option>
            ))}
          </select>
          <button onClick={fetchAircrafts} className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700">
            Search
          </button>
        </div>
      </div>


      {/* Aircraft List */}
      <div className="bg-white border p-4 rounded shadow">
        <h4 className="text-lg font-semibold mb-3 text-blue-700">📋 Aircraft List</h4>
        {isSearching ? (
          <p className="text-blue-500">🔄 Searching...</p>
        ) : searchError ? (
          <p className="text-red-500">{searchError}</p>
        ) : aircrafts.length === 0 ? (
          <p className="text-gray-600">No aircrafts found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-300">
              <thead className="bg-blue-100 text-blue-700">
                <tr>
                  <th className="p-3 border">Aircraft Number</th>
                  <th className="p-3 border">Model</th>
                  <th className="p-3 border">Economy Seats</th>
                  <th className="p-3 border">Premium Seats</th>
                </tr>
              </thead>
              <tbody>
                {aircrafts.map((aircraft: Aircraft, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="p-3 border">{aircraft.aircraftNumber}</td>
                    <td className="p-3 border">{aircraft.aircraftModel}</td>
                    <td className="p-3 border">{aircraft.economySeats}</td>
                    <td className="p-3 border">{aircraft.premiumSeats}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AircraftManagement;
