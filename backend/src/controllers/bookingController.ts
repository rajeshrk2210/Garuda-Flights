import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Booking } from "../models/Booking";
import { Flight } from "../models/Flight";
import { JwtPayload } from "jsonwebtoken";

/** Extend Express Request for JWT decoded user */
interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { _id: string };
}

export const createBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { flights, seatClass, passengers, contactDetails, price } = req.body;

    if (!userId || !flights?.length || !seatClass || !passengers?.length || !contactDetails || !price) {
      res.status(400).json({ message: "Missing booking details" });
      return;
    }

    const pnr = uuidv4().slice(0, 8).toUpperCase();
    const seatAssignments: { flight: string; seatNumbers: string[] }[] = [];

    for (const flightId of flights) {
      const flight = await Flight.findById(flightId);
      if (!flight) {
        res.status(404).json({ message: `Flight not found: ${flightId}` });
        return;
      }

      const classKey = seatClass.toLowerCase() as "economy" | "premium";
      const availableSeats = flight.availableSeats[classKey];

      if (!availableSeats || availableSeats.length < passengers.length) {
        res.status(400).json({ message: `Not enough available seats on flight ${flightId}` });
        return;
      }

      const assignedSeats = availableSeats.slice(0, passengers.length);
      seatAssignments.push({
        flight: flightId,
        seatNumbers: assignedSeats.map((s) => s.toString()),
      });

      flight.availableSeats[classKey] = availableSeats.slice(passengers.length);
      flight.bookedSeats[classKey] = [...(flight.bookedSeats[classKey] || []), ...assignedSeats];

      await flight.save();
    }

    const newBooking = new Booking({
      user: userId,
      flights,
      pnr,
      seatClass,
      seatAssignments,
      passengers,
      contactDetails,
      price,
      status: "CONFIRMED",
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking successful", booking: newBooking });
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


/** ✅ Fetch all bookings for the logged-in user */
export const getUserBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;

    const bookings = await Booking.find({ user: userId })
      .populate("flights")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

/** ✅ Cancel a booking and return seats */
type SeatClassKey = "economy" | "premium";

export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingId = req.params.id;
    const userId = (req as any).user._id;

    const booking = await Booking.findOne({ _id: bookingId, user: userId });

    if (!booking) {
      res.status(404).json({ message: "Booking not found or unauthorized" });
      return;
    }

    if (booking.status === "CANCELLED") {
      res.status(400).json({ message: "Booking is already cancelled" });
      return;
    }

    booking.status = "CANCELLED";
    await booking.save();

    const classKey = booking.seatClass.toLowerCase() as SeatClassKey;

    for (const assignment of booking.seatAssignments) {
      const flight = await Flight.findById(assignment.flight);
      if (!flight) continue;

      const seatNumbers = assignment.seatNumbers.map(Number);

      // Ensure arrays exist
      flight.availableSeats[classKey] = flight.availableSeats[classKey] || [];
      flight.bookedSeats[classKey] = flight.bookedSeats[classKey] || [];

      // Restore seats
      flight.availableSeats[classKey].push(...seatNumbers);
      flight.availableSeats[classKey].sort((a, b) => a - b);

      flight.bookedSeats[classKey] = flight.bookedSeats[classKey].filter(
        (seat) => !seatNumbers.includes(seat)
      );

      await flight.save();
    }

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("❌ Error cancelling booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

