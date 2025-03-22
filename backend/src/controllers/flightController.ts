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

export const getFlightById = async (req: Request, res: Response): Promise<void> => {
  try {
    const flight = await Flight.findById(req.params.id).populate("route");
    if (!flight) {
      res.status(404).json({ message: "Flight not found" });
      return;
    }
    res.status(200).json(flight);
  } catch (error) {
    console.error("❌ Error fetching flight by ID:", error);
    res.status(500).json({ message: "Error fetching flight" });
  }
};

/** ✅ Update Flight (Admin only) */
export const updateFlight = async (req: Request, res: Response): Promise<void> => {
  try {
    const flightId = req.params.id;
    const { departureDate, departureTime, status } = req.body;

    const flight = await Flight.findById(flightId);
    if (!flight) {
      res.status(404).json({ message: "Flight not found." });
      return;
    }

    // Cancel flight if status is passed
    if (status === "CANCELLED") {
      flight.status = "CANCELLED";
      await flight.save();
      res.status(200).json({ message: "Flight cancelled successfully", flight });
      return;
    }

    // Validate date/time before proceeding
    if (!departureDate || !departureTime) {
      res.status(400).json({ message: "Departure date and time are required for updating flight." });
      return;
    }

    const currentDateTime = new Date(`${flight.departureDate}T${flight.departureTime}`);
    const newDateTime = new Date(`${departureDate}T${departureTime}`);

    if (isNaN(newDateTime.getTime())) {
      res.status(400).json({ message: "Invalid departure date or time." });
      return;
    }

    if (newDateTime <= currentDateTime) {
      res.status(400).json({ message: "New departure must be later than current departure time." });
      return;
    }

    // Update departure
    flight.departureDate = departureDate;
    flight.departureTime = departureTime;
    flight.status = "DELAYED";

    // Recalculate arrival
    const route = await Route.findById(flight.route);
    if (!route || !route.duration) {
      res.status(404).json({ message: "Associated route not found or missing duration." });
      return;
    }

    const [hours, minutes] = route.duration.split(":").map(Number);
    const depDateTime = new Date(`${departureDate}T${departureTime}`);
    depDateTime.setHours(depDateTime.getHours() + hours);
    depDateTime.setMinutes(depDateTime.getMinutes() + minutes);

    if (isNaN(depDateTime.getTime())) {
      res.status(400).json({ message: "Invalid calculated arrival time." });
      return;
    }

    flight.arrivalDate = depDateTime.toISOString().split("T")[0];
    flight.arrivalTime = depDateTime.toTimeString().slice(0, 5);

    await flight.save();

    res.status(200).json({ message: "Flight updated successfully", flight });
  } catch (error) {
    console.error("❌ Error updating flight:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFlightStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.toDateString()); // Midnight today
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1); // Start of tomorrow

    // Start of week (Monday)
    const startOfWeek = new Date(startOfToday);
    const dayOfWeek = startOfToday.getDay(); // 0 = Sunday, 1 = Monday, ...
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Make Monday start
    startOfWeek.setDate(startOfWeek.getDate() - offset);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const getCount = async (match: { start: Date; end: Date; extra: any }) => {
      return Flight.countDocuments({
        departureDate: {
          $gte: match.start.toISOString().split("T")[0],
          $lte: match.end.toISOString().split("T")[0],
        },
        ...match.extra,
      });
    };

    const stats = {
      today: await getCount({ start: startOfToday, end: endOfToday, extra: {} }),
      week: await getCount({ start: startOfWeek, end: endOfToday, extra: {} }),
      month: await getCount({ start: startOfMonth, end: endOfToday, extra: {} }),

      cancelledToday: await getCount({ start: startOfToday, end: endOfToday, extra: { status: "CANCELLED" } }),
      cancelledWeek: await getCount({ start: startOfWeek, end: endOfToday, extra: { status: "CANCELLED" } }),
      cancelledMonth: await getCount({ start: startOfMonth, end: endOfToday, extra: { status: "CANCELLED" } }),

      delayedToday: await getCount({ start: startOfToday, end: endOfToday, extra: { status: "DELAYED" } }),
      delayedWeek: await getCount({ start: startOfWeek, end: endOfToday, extra: { status: "DELAYED" } }),
      delayedMonth: await getCount({ start: startOfMonth, end: endOfToday, extra: { status: "DELAYED" } }),
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("❌ Error fetching flight stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

