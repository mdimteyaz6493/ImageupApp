// Load environment variables as early as possible
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";


const app = express();
const __dirname = path.resolve();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Only if using local storage

// Resolve __dirname in ES Module
// app.use(express.static(path.join(__dirname,"/frontend/dist")))
// app.get('*',(_,res)=>{
//   res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
// })

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/images", imageRoutes);



mongoose
  .connect(process.env.MONGO_URI, {
  })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
