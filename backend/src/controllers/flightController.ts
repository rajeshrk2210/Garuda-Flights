import { Request, Response } from "express";
import { Flight } from "../models/Flight";
import Route, { IRoute } from "../models/Route";

/** ✅ Helper Function to Calculate Arrival Date & Time */
const calculateArrivalDetails = (departureDate: string, departureTime: string, duration: string) => {
  const depDateTime = new Date(`${departureDate}T${departureTime}`);
  const [durationHours, durationMinutes] = duration.split(":").map(Number);
  depDateTime.setHours(depDateTime.getHours() + durationHours);
  depDateTime.setMinutes(depDateTime.getMinutes() + durationMinutes);

  return {
    arrivalDate: depDateTime.toISOString().split("T")[0], // YYYY-MM-DD format
    arrivalTime: depDateTime.toTimeString().slice(0, 5), // HH:MM format
  };
};

export const getFlights = async (req: Request, res: Response): Promise<void> => {
  try {
    const { aircraftNumber, startLocation, endLocation, departureDate } = req.query;
    let filter: any = {};

    if (aircraftNumber) filter.aircraftNumber = aircraftNumber;
    if (departureDate) filter.departureDate = departureDate;

    if (startLocation || endLocation) {
      const routes = await Route.find({
        ...(startLocation && { startLocation }),
        ...(endLocation && { endLocation }),
      }).select("_id");

      if (routes.length === 0) {
        res.status(404).json({ message: "No matching flights found." });
        return;
      }

      filter.route = { $in: routes.map((route) => route._id) };
    }

    let flights = await Flight.find(filter).populate<{ route: IRoute }>("route").lean();

    if (flights.length === 0) {
      res.status(404).json({ message: "No flights found." });
      return;
    }

    const updatedFlights = flights.map((flight) => {
      if (!flight.route || !flight.route.duration) {
        return { ...flight, arrivalDate: null, arrivalTime: null };
      }

      const arrivalDetails = calculateArrivalDetails(
        flight.departureDate,
        flight.departureTime,
        flight.route.duration
      );
      return { ...flight, ...arrivalDetails };
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
