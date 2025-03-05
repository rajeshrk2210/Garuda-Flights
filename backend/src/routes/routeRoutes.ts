import { Router } from "express";
import { addRoute, getRoutes, getLocations } from "../controllers/routeController";

const router = Router();

router.post("/add", addRoute); // ✅ Ensure this route exists
router.get("/", getRoutes);
router.get("/locations", getLocations);

export default router;
