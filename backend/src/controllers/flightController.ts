import { Request, Response } from "express";
import { Flight } from "../models/Flight";

/**
 * Get all flights
 */
export const getFlights = async (req: Request, res: Response): Promise<void> => {
  try {
    const flights = await Flight.find();
    res.status(200).json(flights);
  } catch (error) {
    console.error("Error fetching flights:", error);
    res.status(500).json({ message: "Error fetching flights" });
  }
};

/**
 * Create a new flight (Admin only)
 */
export const createFlight = async (req: Request, res: Response): Promise<void> => {
  console.log("📩 Incoming Flight Request:", req.body); // Log request data

  try {
    const { aircraftNumber, routeId, departureDate, departureTime, economyPrice, premiumPrice } = req.body;

    if (!aircraftNumber || !routeId || !departureDate || !departureTime || !economyPrice || !premiumPrice) {
      console.error("❌ Missing Fields");
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const newFlight = new Flight({ 
      aircraftNumber, 
      route: routeId, // ✅ Corrected to match schema
      departureDate, 
      departureTime, 
      economyPrice, 
      premiumPrice,
      status: "OK"
    });

    await newFlight.save();
    console.log("✅ Flight Added Successfully:", newFlight);

    res.status(201).json({ message: "Flight added successfully", flight: newFlight });
  } catch (error) {
    console.error("❌ Internal Server Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update flight details (Admin only)
 */
export const updateFlight = async (req: Request, res: Response): Promise<void> => {
  try {
    const { flightId } = req.params;
    const updatedData = req.body;

    const updatedFlight = await Flight.findByIdAndUpdate(flightId, updatedData, { new: true });

    if (!updatedFlight) {
      res.status(404).json({ message: "Flight not found" });
      return;
    }

    res.status(200).json({ message: "Flight updated successfully", flight: updatedFlight });
  } catch (error) {
    console.error("Error updating flight:", error);
    res.status(400).json({ message: "Error updating flight" });
  }
};

/**
 * Delete a flight (Admin only)
 */
export const deleteFlight = async (req: Request, res: Response): Promise<void> => {
  try {
    const { flightId } = req.params;

    const deletedFlight = await Flight.findByIdAndDelete(flightId);

    if (!deletedFlight) {
      res.status(404).json({ message: "Flight not found" });
      return;
    }

    res.status(200).json({ message: "Flight deleted successfully" });
  } catch (error) {
    console.error("Error deleting flight:", error);
    res.status(400).json({ message: "Error deleting flight" });
  }
};
