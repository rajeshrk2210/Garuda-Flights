import { useState } from "react";

const Admin = () => {
  const [newAircraft, setNewAircraft] = useState({
    aircraftNumber: "",
    aircraftModel: "", // ✅ Ensure correct key name
    economySeats: "",
    premiumSeats: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAircraft((prevAircraft) => ({
      ...prevAircraft,
      [name]: value, // ✅ Dynamically update field based on name
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
        setNewAircraft({ aircraftNumber: "", aircraftModel: "", economySeats: "", premiumSeats: "" }); // ✅ Reset form
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      alert("❌ Network Error: Failed to connect to backend.");
    }
  };

  return (
    <div>
      <h2>Admin - Manage Aircrafts</h2>
      <input type="text" name="aircraftNumber" value={newAircraft.aircraftNumber} onChange={handleInputChange} placeholder="Aircraft Number" />
      <select name="aircraftModel" value={newAircraft.aircraftModel} onChange={handleInputChange}>
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
      <input type="number" name="economySeats" value={newAircraft.economySeats} onChange={handleInputChange} placeholder="Economy Seats" />
      <input type="number" name="premiumSeats" value={newAircraft.premiumSeats} onChange={handleInputChange} placeholder="Premium Seats" />
      <button onClick={addAircraft}>Add Aircraft</button>
    </div>
  );
};

export default Admin;
