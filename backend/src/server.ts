import app from "./index";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();  // Load environment variables

const PORT = process.env.PORT || 5000;

// Connect to MongoDB & start server
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error("❌ Database connection error:", err));
