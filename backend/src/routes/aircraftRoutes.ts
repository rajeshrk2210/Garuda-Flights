import { Router } from "express";
import { addAircraft } from "../controllers/aircraftController";

const router = Router();

const aircraftModels = [
  "Boeing 737",
  "Boeing 747",
  "Boeing 777",
  "Boeing 787 Dreamliner",
  "Airbus A320",
  "Airbus A330",
  "Airbus A350",
  "Airbus A380",
  "Embraer E190",
  "Bombardier CRJ900"
];

// ✅ Fix TypeScript issue with request handler types
router.get("/aircraft-models", (req, res) => {
  res.json(aircraftModels);
});

// ✅ Ensure correct type for Express route handler
router.post("/add", (req, res) => addAircraft(req, res));

export default router;
