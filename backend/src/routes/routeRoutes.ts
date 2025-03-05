import { Router } from "express";
import { addRoute, getRoutes, getLocations } from "../controllers/routeController";

const router = Router();

router.post("/add", async (req, res, next) => {
  try {
    await addRoute(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    await getRoutes(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/locations", async (req, res, next) => {
  try {
    await getLocations(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
