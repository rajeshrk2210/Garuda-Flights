import { useState, useEffect } from "react";

interface Aircraft {
  aircraftNumber: string;
  aircraftModel: string;
  economySeats: number;
  premiumSeats: number;
}

const Admin = () => {
  const [newAircraft, setNewAircraft] = useState<Aircraft>({
    aircraftNumber: "",
    aircraftModel: "",
    economySeats: 0,
    premiumSeats: 0,
  });

  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]); // ✅ Define state type

  const [searchAircraftNumber, setSearchAircraftNumber] = useState("");
  const [searchAircraftModel, setSearchAircraftModel] = useState("");

  useEffect(() => {
    fetchAircrafts(); // Fetch aircrafts on page load
  }, []);

  const fetchAircrafts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/aircrafts?aircraftNumber=${searchAircraftNumber}&aircraftModel=${searchAircraftModel}`);
      const data: Aircraft[] = await response.json(); // ✅ Ensure correct data type
      setAircrafts(data);
    } catch (error) {
      console.error("❌ Error fetching aircrafts:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAircraft((prevAircraft) => ({
      ...prevAircraft,
      [name]: value,
    }));
  };

  const addAircraft = async () => {
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin - Manage Aircrafts</h2>

      {/* Add Aircraft Form */}
      <div className="bg-white p-4 rounded shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-2">Add Aircraft</h3>
        <input type="text" name="aircraftNumber" value={newAircraft.aircraftNumber} onChange={handleInputChange} placeholder="Aircraft Number" className="border p-2 w-full mb-2" />
        <select name="aircraftModel" value={newAircraft.aircraftModel} onChange={handleInputChange} className="border p-2 w-full mb-2">
          <option value="">Select Model</option>
          <option value="Boeing 737">Boeing 737</option>
          <option value="Boeing 747">Boeing 747</option>
          <option value="Boeing 777">Boeing 777</option>
          <option value="Boeing 787 Dreamliner">Boeing 787 Dreamliner</option>
          <option value="Airbus A320">Airbus A320</option>
          <option value="Airbus A330">Airbus A330</option>
          <option value="Airbus A350">Airbus A350</option>
          <option value="Airbus A380">Airbus A380</option>
          <option value="Embraer E190">Embraer E190</option>
          <option value="Bombardier CRJ900">Bombardier CRJ900</option>
        </select>
        <input type="number" name="economySeats" value={newAircraft.economySeats} onChange={handleInputChange} placeholder="Economy Seats" className="border p-2 w-full mb-2" />
        <input type="number" name="premiumSeats" value={newAircraft.premiumSeats} onChange={handleInputChange} placeholder="Premium Seats" className="border p-2 w-full mb-2" />
        <button onClick={addAircraft} className="bg-blue-500 text-white px-4 py-2 rounded">Add Aircraft</button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Search Aircrafts</h3>
        <input type="text" placeholder="Search by Aircraft Number" className="border p-2 mr-2" value={searchAircraftNumber} onChange={(e) => setSearchAircraftNumber(e.target.value)} />
        <input type="text" placeholder="Search by Model" className="border p-2 mr-2" value={searchAircraftModel} onChange={(e) => setSearchAircraftModel(e.target.value)} />
        <button onClick={fetchAircrafts} className="bg-green-500 text-white px-4 py-2 rounded">Search</button>
      </div>

      {/* Aircraft List */}
      <h3 className="text-lg font-semibold">Aircraft List</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Aircraft Number</th>
            <th className="border p-2">Model</th>
            <th className="border p-2">Economy Seats</th>
            <th className="border p-2">Premium Seats</th>
          </tr>
        </thead>
        <tbody>
          {aircrafts.map((aircraft: Aircraft, index) => ( // ✅ Explicitly define type
            <tr key={index} className="border">
              <td className="border p-2">{aircraft.aircraftNumber}</td>
              <td className="border p-2">{aircraft.aircraftModel}</td>
              <td className="border p-2">{aircraft.economySeats}</td>
              <td className="border p-2">{aircraft.premiumSeats}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
