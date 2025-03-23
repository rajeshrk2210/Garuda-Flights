import { Request, Response } from "express";
import Route from "../models/Route";

// Predefined Locations (Hardcoded)
const locations = [
  "Toronto", "Vancouver", "Montreal", "Calgary", "Edmonton",
  "Ottawa", "Winnipeg", "Quebec City", "Halifax", "Victoria"
];

export const addRoute = async (req: Request, res: Response): Promise<void> => {
  console.log("📩 Received Add Route Request:", req.body); // 🔹 Log request data

  try {
    const { startLocation, endLocation, distance, duration } = req.body;

    if (!startLocation || !endLocation || !distance || !duration) {
      console.error("❌ Missing Fields");
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    if (startLocation === endLocation) {
      console.error("❌ Start and End Locations are the Same");
      res.status(400).json({ message: "Start and End locations cannot be the same" });
      return;
    }

    const newRoute = new Route({ startLocation, endLocation, distance, duration });
    await newRoute.save();
    console.log("✅ Route Added Successfully:", newRoute);

    res.status(201).json({ message: "Route added successfully", route: newRoute });
  } catch (error) {
    console.error("❌ Error Adding Route:", error);
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

export const getLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    const startLocations = await Route.distinct("startLocation");
    const endLocations = await Route.distinct("endLocation");

    const uniqueLocations = Array.from(new Set([...startLocations, ...endLocations]));
    res.status(200).json(uniqueLocations);
  } catch (error) {
    console.error("❌ Error fetching locations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRouteCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const count = await Route.countDocuments();
    res.status(200).json(count);
  } catch (error) {
    console.error("❌ Error counting routes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
