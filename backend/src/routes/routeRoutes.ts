import { Router } from "express";
import { addRoute, getRoutes, getLocations, getRouteCount } from "../controllers/routeController";

const router = Router();

router.post("/add", addRoute); // ✅ Ensure this route exists
router.get("/", getRoutes);
router.get("/locations", getLocations);
router.get("/count", getRouteCount);

export default router;
