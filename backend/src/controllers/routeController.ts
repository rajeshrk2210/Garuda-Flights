import { Request, Response } from "express";
import { Route } from "../models/Route";
import { LOCATIONS } from "../utils/locations";

/**
 * Get all routes
 */
export const getRoutes = async (req: Request, res: Response): Promise<void> => {
  try {
    const routes = await Route.find();
    res.status(200).json(routes);
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).json({ message: "Error fetching routes" });
  }
};

/**
 * Create a new route (Admin only)
 */
export const createRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startLocation, endLocation, distance, duration } = req.body;

    if (!startLocation || !endLocation || !distance || !duration) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (!LOCATIONS.includes(startLocation) || !LOCATIONS.includes(endLocation)) {
      res.status(400).json({ message: "Invalid locations. Must be from predefined locations" });
      return;
    }

    const newRoute = new Route({ startLocation, endLocation, distance, duration });
    await newRoute.save();

    res.status(201).json({ message: "Route created successfully", route: newRoute });
  } catch (error) {
    console.error("Error creating route:", error);
    res.status(400).json({ message: "Error creating route" });
  }
};

/**
 * Update a route (Admin only)
 */
export const updateRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    const { routeId } = req.params;
    const updatedData = req.body;

    const updatedRoute = await Route.findByIdAndUpdate(routeId, updatedData, { new: true });

    if (!updatedRoute) {
      res.status(404).json({ message: "Route not found" });
      return;
    }

    res.status(200).json({ message: "Route updated successfully", route: updatedRoute });
  } catch (error) {
    console.error("Error updating route:", error);
    res.status(400).json({ message: "Error updating route" });
  }
};

/**
 * Delete a route (Admin only)
 */
export const deleteRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    const { routeId } = req.params;

    const deletedRoute = await Route.findByIdAndDelete(routeId);

    if (!deletedRoute) {
      res.status(404).json({ message: "Route not found" });
      return;
    }

    res.status(200).json({ message: "Route deleted successfully" });
  } catch (error) {
    console.error("Error deleting route:", error);
    res.status(400).json({ message: "Error deleting route" });
  }
};
