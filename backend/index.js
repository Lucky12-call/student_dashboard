import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import studentRouter from "./src/routes/student.route.js";
import authRouter from "./src/routes/auth.route.js";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cookieParser());
// CORS FIX
app.use(
  cors({
    origin: "https://student-dashboard-94dd.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use("/api/v1", studentRouter);
app.use("/api/v1/admin", authRouter);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
