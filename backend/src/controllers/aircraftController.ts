import { Request, Response } from "express";
import Aircraft from "../models/Aircraft";

/**
 * Add a new aircraft
 * @route POST /api/aircrafts/add
 */
export const addAircraft = async (req: Request, res: Response): Promise<void> => {
  try {
    const { aircraftNumber, aircraftModel, economySeats, premiumSeats } = req.body;

    if (!aircraftNumber || !aircraftModel || !economySeats || !premiumSeats) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const existingAircraft = await Aircraft.findOne({ aircraftNumber });
    if (existingAircraft) {
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
    console.log("✅ Aircraft Added:", newAircraft);
    res.status(201).json({ message: "Aircraft added successfully", aircraft: newAircraft });
  } catch (error) {
    console.error("❌ Error adding aircraft:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Fetch aircrafts with optional search
 * @route GET /api/aircrafts
 */
export const getAircrafts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { aircraftNumber, aircraftModel } = req.query;
    let query: any = {};

    if (aircraftNumber && typeof aircraftNumber === "string") {
      query.aircraftNumber = { $regex: new RegExp(aircraftNumber, "i") };
    }
    if (aircraftModel && typeof aircraftModel === "string") {
      query.aircraftModel = { $regex: new RegExp(aircraftModel, "i") };
    }

    const aircrafts = await Aircraft.find(query);

    if (aircrafts.length === 0) {
      res.status(200).json([]); // ✅ Send empty array instead of 404 error
      return;
    }

    res.status(200).json(aircrafts);
  } catch (error) {
    console.error("❌ Error fetching aircrafts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

