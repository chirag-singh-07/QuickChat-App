import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import connectDB from "./database/database.js";
import messageRoutes from "./routes/messageRoutes.js";
import { app, server } from "./utils/socket.js";
import path from "path";
import cronJob from "./utils/cron.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL], // Change this to your frontend URL
    credentials: true, // Enable setting cookies
  })
); // Enable CORS for all routes

connectDB();
cronJob()

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.get("/api/check", (req, res) => {
  console.log("http Request is check good...");
  res.send("Active ✅");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
