import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/authRoutes";
import flightRoutes from "./routes/flightRoutes";
import routeRoutes from "./routes/routeRoutes";
import aircraftRoutes from "./routes/aircraftRoutes";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Load Swagger API documentation safely
let swaggerDocument: any;
try {
  const swaggerData = fs.readFileSync("./src/docs/swagger.json", "utf-8");
  swaggerDocument = JSON.parse(swaggerData);
} catch (error) {
  console.error("Error loading Swagger JSON:", error);
  swaggerDocument = {}; // Fallback to empty object to prevent crashes
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ✅ Ensure aircraft route is correctly registered
app.use("/api/aircrafts", aircraftRoutes);

app.use("/auth", authRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/routes", routeRoutes); // ✅ Correct API route


// Test route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to Garuda Flights API" });
});

export default app;
