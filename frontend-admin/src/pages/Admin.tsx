import { useState, useEffect } from "react";

interface Aircraft {
  aircraftNumber: string;
  aircraftModel: string;
  economySeats: number;
  premiumSeats: number;
}

const aircraftModels = [
  "Boeing 737", "Boeing 747", "Boeing 777", "Boeing 787 Dreamliner",
  "Airbus A320", "Airbus A330", "Airbus A350", "Airbus A380",
  "Embraer E190", "Bombardier CRJ900"
];

const Admin = () => {
  const [newAircraft, setNewAircraft] = useState<Aircraft>({
    aircraftNumber: "",
    aircraftModel: "",
    economySeats: 0,
    premiumSeats: 0,
  });

  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [searchAircraftNumber, setSearchAircraftNumber] = useState("");
  const [searchAircraftModel, setSearchAircraftModel] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null); // ✅ Track search errors

  useEffect(() => {
    fetchAircrafts();
  }, []);

  /** 🔹 Fetch Aircrafts */
  const fetchAircrafts = async () => {
    setIsSearching(true);
    setSearchError(null); // Reset error message before fetching

    try {
      const response = await fetch(
        `http://localhost:5000/api/aircrafts?aircraftNumber=${searchAircraftNumber}&aircraftModel=${searchAircraftModel}`
      );
      const data = await response.json();

      if (response.ok) {
        if (Array.isArray(data) && data.length === 0) {
          setSearchError("❌ No matching aircrafts found."); // ✅ Handle empty results
        } else {
          setAircrafts(data);
        }
      } else {
        setSearchError(data.message || "❌ Error fetching aircrafts.");
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      setSearchError("❌ Failed to fetch aircrafts.");
    } finally {
      setIsSearching(false);
    }
  };

  const addAircraft = async () => {
    if (!newAircraft.aircraftNumber || !newAircraft.aircraftModel || newAircraft.economySeats <= 0 || newAircraft.premiumSeats <= 0) {
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
      alert("❌ Network error: Failed to connect to backend.");
    }
  };
  

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Admin Panel</h2>

      {/* ----------------- Aircraft Management ----------------- */}
      <div className="bg-white p-6 rounded shadow-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">✈️ Aircraft Management</h3>

        {/* Add Aircraft */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">Add Aircraft</h4>
          <input type="text" placeholder="Aircraft Number" className="border p-2 w-full mb-2" onChange={(e) => setNewAircraft({ ...newAircraft, aircraftNumber: e.target.value })} />
          <select className="border p-2 w-full mb-2" onChange={(e) => setNewAircraft({ ...newAircraft, aircraftModel: e.target.value })}>
            <option value="">Select Model</option>
            {aircraftModels.map((model, index) => <option key={index} value={model}>{model}</option>)}
          </select>
          <input type="number" placeholder="Economy Seats" className="border p-2 w-full mb-2" onChange={(e) => setNewAircraft({ ...newAircraft, economySeats: Number(e.target.value) })} />
          <input type="number" placeholder="Premium Seats" className="border p-2 w-full mb-2" onChange={(e) => setNewAircraft({ ...newAircraft, premiumSeats: Number(e.target.value) })} />
          <button onClick={addAircraft} className="bg-blue-500 text-white px-4 py-2 rounded">Add Aircraft</button>
        </div>

        {/* Search & Display Aircrafts */}
        <h4 className="text-lg font-semibold mb-2">Search Aircrafts</h4>
        <input type="text" placeholder="Search by Aircraft Number" className="border p-2 mr-2" onChange={(e) => setSearchAircraftNumber(e.target.value)} />
        <select className="border p-2 mr-2" onChange={(e) => setSearchAircraftModel(e.target.value)}>
          <option value="">All Models</option>
          {aircraftModels.map((model, index) => <option key={index} value={model}>{model}</option>)}
        </select>
        <button onClick={fetchAircrafts} className="bg-green-500 text-white px-4 py-2 rounded">Search</button>

        {/* ✅ Display Search Results */}
        <h4 className="text-lg font-semibold mt-4">Aircraft List</h4>
        {isSearching ? (
          <p className="text-blue-500 mt-2">🔄 Searching...</p>
        ) : searchError ? (
          <p className="text-red-500 mt-2">{searchError}</p> // ✅ Shows "No results found"
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
    </div>
  );
};

export default Admin;
