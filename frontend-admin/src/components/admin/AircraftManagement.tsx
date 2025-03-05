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

  useEffect(() => {
    fetchAircrafts();
  }, []);

  const fetchAircrafts = async () => {
    setSearchError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/aircrafts?aircraftNumber=${searchAircraftNumber}&aircraftModel=${searchAircraftModel}`);
      const data = await response.json();

      if (response.ok) {
        setAircrafts(data.length ? data : []);
        if (!data.length) setSearchError("❌ No matching aircrafts found.");
      } else {
        setSearchError(data.message || "❌ Error fetching aircrafts.");
      }
    } catch (error) {
      setSearchError("❌ Failed to fetch aircrafts.");
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
        fetchAircrafts(); // Refresh list
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      alert("❌ Network error: Failed to connect to backend.");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-lg mb-8">
      <h3 className="text-xl font-semibold mb-4">✈️ Aircraft Management</h3>

      {/* Add Aircraft */}
      <div className="mb-6">
        <input type="text" placeholder="Aircraft Number" className="border p-2 w-full mb-2" onChange={(e) => setNewAircraft({ ...newAircraft, aircraftNumber: e.target.value })} />
        <select className="border p-2 w-full mb-2" onChange={(e) => setNewAircraft({ ...newAircraft, aircraftModel: e.target.value })}>
          <option value="">Select Model</option>
          {aircraftModels.map((model, index) => <option key={index} value={model}>{model}</option>)}
        </select>
        <input type="number" placeholder="Economy Seats" className="border p-2 w-full mb-2" onChange={(e) => setNewAircraft({ ...newAircraft, economySeats: Number(e.target.value) })} />
        <input type="number" placeholder="Premium Seats" className="border p-2 w-full mb-2" onChange={(e) => setNewAircraft({ ...newAircraft, premiumSeats: Number(e.target.value) })} />
        <button onClick={addAircraft} className="bg-blue-500 text-white px-4 py-2 rounded">Add Aircraft</button>
      </div>

      {/* Display Aircrafts */}
      {searchError ? <p className="text-red-500 mt-2">{searchError}</p> : (
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
            {aircrafts.map((aircraft, index) => (
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
