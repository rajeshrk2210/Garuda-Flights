import { Request, Response } from "express";
import Aircraft from "../models/Aircraft";

const allowedModels = [
  "Boeing 737",
  "Boeing 747",
  "Boeing 777",
  "Boeing 787 Dreamliner",
  "Airbus A320",
  "Airbus A330",
  "Airbus A350",
  "Airbus A380",
  "Embraer E190",
  "Bombardier CRJ900"
];

export const addAircraft = async (req: Request, res: Response): Promise<void> => {  // ✅ Explicit return type
  try {
    const { aircraftNumber, aircraftModel, economySeats, premiumSeats } = req.body;

    if (!aircraftNumber || !aircraftModel || !economySeats || !premiumSeats) {
      console.warn("❌ Missing required fields:", req.body);
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (!allowedModels.includes(aircraftModel)) {
      res.status(400).json({ message: "Invalid aircraft model" });
      return;
    }

    const existingAircraft = await Aircraft.findOne({ aircraftNumber });
    if (existingAircraft) {
      console.warn("❌ Duplicate Aircraft Number:", aircraftNumber);
      res.status(400).json({ message: "Aircraft Number must be unique" });
      return;
    }

    const newAircraft = new Aircraft({
      aircraftNumber,
      aircraftModel,
      economySeats,
      premiumSeats,
    });

    await newAircraft.save();
    console.log("✅ Aircraft Added Successfully:", newAircraft);
    res.status(201).json({ message: "Aircraft added successfully", aircraft: newAircraft });

  } catch (error) {
    let errorMessage = "Internal server error";

    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("❌ Error adding aircraft:", error.message);
    } else {
      console.error("❌ Unknown error occurred while adding aircraft.");
    }

    res.status(500).json({ message: errorMessage });
  }
};
