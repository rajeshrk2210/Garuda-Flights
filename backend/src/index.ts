import express, { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";

// ✅ Import Routes
import authRoutes from "./routes/authRoutes";
import flightRoutes from "./routes/flightRoutes";
import routeRoutes from "./routes/routeRoutes";
import aircraftRoutes from "./routes/aircraftRoutes";
import bookingRoutes from "./routes/bookingRoutes";

dotenv.config(); // ✅ Load environment variables
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));


// ✅ Load Swagger API documentation safely
let swaggerDocument: any;
try {
  const swaggerPath = "./src/docs/swagger.json";
  if (fs.existsSync(swaggerPath)) {
    const swaggerData = fs.readFileSync(swaggerPath, "utf-8");
    swaggerDocument = JSON.parse(swaggerData);
  } else {
    console.error("⚠️ Swagger JSON file not found.");
    swaggerDocument = {};
  }
} catch (error) {
  console.error("❌ Error loading Swagger JSON:", error);
  swaggerDocument = {};
}

// ✅ Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ✅ Register API Routes
app.use("/api/aircrafts", aircraftRoutes);
app.use("/auth", authRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/bookings", bookingRoutes);

// ✅ Test route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to Garuda Flights API" });
});

// ✅ Global Error Handling Middleware (Prevents Crashes)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Internal Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
