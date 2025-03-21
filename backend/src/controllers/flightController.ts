import { Request, Response } from "express";
import { Flight, IFlight } from "../models/Flight";
import Route, { IRoute } from "../models/Route";
import mongoose from "mongoose";

/** ✅ Helper Function to Calculate Arrival Date & Time */
const calculateArrivalDetails = (departureDate: string, departureTime: string, duration: string) => {
  const depDateTime = new Date(`${departureDate}T${departureTime}`);
  const [durationHours, durationMinutes] = duration.split(":").map(Number);
  depDateTime.setHours(depDateTime.getHours() + durationHours);
  depDateTime.setMinutes(depDateTime.getMinutes() + durationMinutes);

  return {
    arrivalDate: depDateTime.toISOString().split("T")[0], // YYYY-MM-DD format
    arrivalTime: depDateTime.toTimeString().slice(0, 5),   // HH:MM format
  };
};

export const getFlights = async (req: Request, res: Response): Promise<void> => {
  try {
    const { aircraftNumber, startLocation, endLocation, type } = req.query;
    const filter: any = {};

    if (aircraftNumber) filter.aircraftNumber = aircraftNumber;

    if (startLocation || endLocation) {
      const routeFilters: any = {};
      if (startLocation) routeFilters.startLocation = startLocation;
      if (endLocation) routeFilters.endLocation = endLocation;

      const routes = await Route.find(routeFilters).select("_id");
      if (routes.length === 0) {
        res.status(200).json([]); // Return empty array if no matching routes
        return;
      }

      filter.route = { $in: routes.map((r) => r._id) };
    }

    // Fetch flights with route populated
    let flights = await Flight.find(filter)
      .populate<{ route: IRoute }>("route")
      .lean();

    if (!flights.length) {
      res.status(200).json([]); // Return empty array instead of 404
      return;
    }

    // 🔍 Filter by type (Upcoming / Previous) based on date and time
    if (type === "Upcoming" || type === "Previous") {
      const now = new Date();
      flights = flights.filter((flight) => {
        const depDateTime = new Date(`${flight.departureDate}T${flight.departureTime}`);
        return type === "Upcoming" ? depDateTime > now : depDateTime < now;
      });
    }

    // 🧮 Calculate and attach arrival details
    const updatedFlights = flights.map((flight) => {
      const routeDuration = (flight.route as IRoute)?.duration;
      if (!routeDuration) return flight; // Skip arrival if route missing

      const { arrivalDate, arrivalTime } = calculateArrivalDetails(
        flight.departureDate,
        flight.departureTime,
        routeDuration
      );

      return {
        ...flight,
        arrivalDate,
        arrivalTime,
      };
    });

    res.status(200).json(updatedFlights);
  } catch (error) {
    console.error("❌ Error fetching flights:", error);
    res.status(500).json({ message: "Error fetching flights" });
  }
};


export const createFlight = async (req: Request, res: Response): Promise<void> => {
  console.log("📩 Incoming Flight Request:", req.body);

  try {
    const { aircraftNumber, routeId, departureDate, departureTime, economyPrice, premiumPrice } = req.body;

    if (!aircraftNumber || !routeId || !departureDate || !departureTime || !economyPrice || !premiumPrice) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }

    const route = await Route.findById(routeId);
    if (!route) {
      res.status(404).json({ message: "Route not found." });
      return;
    }

    const { arrivalDate, arrivalTime } = calculateArrivalDetails(departureDate, departureTime, route.duration);

    const newFlight = new Flight({
      aircraftNumber,
      route: routeId,
      departureDate,
      departureTime,
      arrivalDate,
      arrivalTime,
      economyPrice,
      premiumPrice,
      status: "OK",
    });

    await newFlight.save();
    console.log("✅ Flight Added Successfully:", newFlight);

    res.status(201).json({ message: "Flight added successfully", flight: newFlight });
  } catch (error) {
    console.error("❌ Error Adding Flight:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
