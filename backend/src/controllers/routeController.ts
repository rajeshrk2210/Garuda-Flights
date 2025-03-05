import { Request, Response } from "express";
import Route from "../models/Route";

// Predefined Locations (Hardcoded)
const locations = [
  "Toronto", "Vancouver", "Montreal", "Calgary", "Edmonton",
  "Ottawa", "Winnipeg", "Quebec City", "Halifax", "Victoria"
];

export const addRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startLocation, endLocation, distance, duration } = req.body;

    if (!startLocation || !endLocation || !distance || !duration) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    if (startLocation === endLocation) {
      res.status(400).json({ message: "Start and End locations cannot be the same" });
      return;
    }

    const existingRoute = await Route.findOne({ startLocation, endLocation });
    if (existingRoute) {
      res.status(400).json({ message: "Route already exists" });
      return;
    }

    const newRoute = new Route({ startLocation, endLocation, distance, duration });
    await newRoute.save();

    console.log("✅ Route Added:", newRoute);
    res.status(201).json({ message: "Route added successfully", route: newRoute });
  } catch (error) {
    console.error("❌ Error adding route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRoutes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startLocation, endLocation } = req.query;

    let filter: any = {};
    if (startLocation) filter.startLocation = startLocation;
    if (endLocation) filter.endLocation = endLocation;

    const routes = await Route.find(filter);
    res.status(200).json(routes);
  } catch (error) {
    console.error("❌ Error fetching routes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLocations = (req: Request, res: Response): void => {
  res.status(200).json(locations);
};
