import { useState, useEffect } from "react";
import apiURL from "../../config/config";

interface Aircraft {
  aircraftNumber: string;
  aircraftModel: string;
  economySeats: number;
  premiumSeats: number;
}

const aircraftModels = [
  "Boeing 737",
  "Boeing 747",
  "Boeing 777",
  "Boeing 787 Dreamliner",
  "Airbus A320",
  "Airbus A330",
  "Airbus A350",
  "Airbus A380",
  "Embraer E190",
  "Bombardier CRJ900",
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

      const response = await fetch(`${apiURL}/api/aircrafts?${queryParams.toString()}`);
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
    if (
      !newAircraft.aircraftNumber ||
      !newAircraft.aircraftModel ||
      !newAircraft.economySeats ||
      !newAircraft.premiumSeats
    ) {
      alert("⚠️ All fields are required!");
      return;
    }

    try {
      const response = await fetch(`${apiURL}/api/aircrafts/add`, {
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
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-2xl font-semibold text-teal-700 mb-6">✈️ Aircraft Management</h3>

      {/* Add Aircraft */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">➕ Add Aircraft</h4>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Aircraft Number</label>
          <input
            type="text"
            placeholder="Aircraft Number"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            value={newAircraft.aircraftNumber}
            onChange={(e) => setNewAircraft({ ...newAircraft, aircraftNumber: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Aircraft Model</label>
          <select
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={newAircraft.aircraftModel}
            onChange={(e) => setNewAircraft({ ...newAircraft, aircraftModel: e.target.value })}
          >
            <option value="">Select Model</option>
            {aircraftModels.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Economy Seats</label>
          <input
            type="number"
            placeholder="Economy Seats"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            value={newAircraft.economySeats || ""}
            onChange={(e) => setNewAircraft({ ...newAircraft, economySeats: Number(e.target.value) })}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Premium Seats</label>
          <input
            type="number"
            placeholder="Premium Seats"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            value={newAircraft.premiumSeats || ""}
            onChange={(e) => setNewAircraft({ ...newAircraft, premiumSeats: Number(e.target.value) })}
          />
        </div>

        <button
          onClick={addAircraft}
          className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200"
        >
          Add Aircraft
        </button>
      </div>

      {/* Search Aircrafts */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">🔍 Search Aircrafts</h4>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-600">Aircraft Number</label>
            <input
              type="text"
              placeholder="Search by Aircraft Number"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
              value={searchAircraftNumber}
              onChange={(e) => setSearchAircraftNumber(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-600">Aircraft Model</label>
            <select
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchAircraftModel}
              onChange={(e) => setSearchAircraftModel(e.target.value)}
            >
              <option value="">All Models</option>
              {aircraftModels.map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchAircrafts}
            className="px-5 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200 self-end"
          >
            Search
          </button>
        </div>
      </div>

      {/* Aircraft List */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">📋 Aircraft List</h4>
        {isSearching ? (
          <p className="text-teal-600">🔄 Searching...</p>
        ) : searchError ? (
          <p className="text-red-600">{searchError}</p>
        ) : aircrafts.length === 0 ? (
          <p className="text-gray-600">No aircrafts found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-200">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="p-3 border-b">Aircraft Number</th>
                  <th className="p-3 border-b">Model</th>
                  <th className="p-3 border-b">Economy Seats</th>
                  <th className="p-3 border-b">Premium Seats</th>
                </tr>
              </thead>
              <tbody>
                {aircrafts.map((aircraft: Aircraft, index) => (
                  <tr key={index} className="hover:bg-teal-50 text-gray-800">
                    <td className="p-3 border-b font-medium">{aircraft.aircraftNumber}</td>
                    <td className="p-3 border-b">{aircraft.aircraftModel}</td>
                    <td className="p-3 border-b">{aircraft.economySeats}</td>
                    <td className="p-3 border-b">{aircraft.premiumSeats}</td>
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