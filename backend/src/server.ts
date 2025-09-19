import express from "express";
import dotenv from "dotenv";
import cors, { type CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./route/authRoutes.js";
import expenseRoutes from "./route/expenseRoutes.js";

dotenv.config();

const app = express();

// ✅ Trust proxy (needed for Render/proxies with secure cookies)
app.set("trust proxy", 1);

// ✅ Allowed origins
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://frontend-one-topaz-21.vercel.app", // Vercel frontend
      ]
    : ["http://localhost:5173", "http://localhost:3000"];

// ✅ CORS config
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman/cURL
    if (allowedOrigins.includes(origin)) {
      return callback(null, origin); // reflect allowed origin
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: false, // ❌ no cookies, using Bearer tokens now
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply CORS once
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());

// ✅ Debug logger
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`
  );
  next();
});

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
  });
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
