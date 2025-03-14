import { Router } from "express";
import { addAircraft, getAircrafts } from "../controllers/aircraftController";

const router = Router();

// ✅ Correctly define search API route
router.get("/", getAircrafts);

// ✅ Define aircraft addition route
router.post("/add", addAircraft);

export default router;
