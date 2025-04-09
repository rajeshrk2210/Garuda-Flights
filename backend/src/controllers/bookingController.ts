import { Request, Response } from "express";
import { Flight } from "../models/Flight";
import Aircraft from "../models/Aircraft";
import { Booking } from "../models/Booking";
import { IUser } from "../models/User";

// POST /api/bookings
export const bookFlight = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const {
      flightId,
      flightClass,
      passengers, // [{ firstName, lastName, gender, dob }]
      contactInfo, // { contactPerson, country, mobile, email }
    } = req.body;

    if (!flightId || !flightClass || !passengers || passengers.length === 0) {
      return res.status(400).json({ message: "Missing required booking details." });
    }

    const flight = await Flight.findById(flightId);
    if (!flight) return res.status(404).json({ message: "Flight not found." });

    const aircraft = await Aircraft.findOne({ aircraftNumber: flight.aircraftNumber });
    if (!aircraft) return res.status(404).json({ message: "Aircraft not found." });

    const existingBookings = await Booking.find({ flight: flightId, flightClass });

    const seatsBooked = existingBookings.reduce((sum, booking) => sum + booking.passengers.length, 0);
    const totalSeats = flightClass === "Economy" ? aircraft.economySeats : aircraft.premiumSeats;

    const seatsLeft = totalSeats - seatsBooked;
    if (seatsLeft < passengers.length) {
      return res.status(400).json({ message: `Only ${seatsLeft} seats left in ${flightClass} class.` });
    }

    // Assign seat numbers
    const seatStart = seatsBooked + 1;
    const seatNumbers = Array.from({ length: passengers.length }, (_, i) => seatStart + i);

    const booking = new Booking({
      user: user._id,
      flight: flight._id,
      flightClass,
      seatNumbers,
      passengers,
      contactInfo,
      price:
        flightClass === "Economy"
          ? flight.economyPrice * passengers.length
          : flight.premiumPrice * passengers.length,
    });

    await booking.save();

    res.status(201).json({
      message: "Booking successful.",
      bookingId: booking._id,
      seatNumbers,
    });
  } catch (error) {
    console.error("❌ Booking Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
