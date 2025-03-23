import app from "./index";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load environment variables

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ Missing MONGODB_URI in environment variables.");
  process.exit(1);
}

// ✅ Connect to MongoDB & start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Database connected successfully");

    // ✅ Start Express Server
    const server = app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

    // ✅ Gracefully handle shutdown
    process.on("SIGINT", async () => {
      console.log("\n🔴 Closing MongoDB connection...");
      await mongoose.connection.close();
      console.log("✅ MongoDB connection closed.");
      server.close(() => {
        console.log("🔴 Server stopped.");
        process.exit(0);
      });
    });

    process.on("SIGTERM", async () => {
      console.log("\n🔴 Received termination signal. Closing MongoDB connection...");
      await mongoose.connection.close();
      console.log("✅ MongoDB connection closed.");
      server.close(() => {
        console.log("🔴 Server stopped.");
        process.exit(0);
      });
    });

  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1); // 🔹 Stop the process if the DB connection fails
  });
