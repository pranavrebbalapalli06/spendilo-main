import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import type { CorsOptions } from "cors"; // ✅ type-only import
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./route/authRoutes.js";
import expenseRoutes from "./route/expenseRoutes.js";

dotenv.config();

const app = express();

// ✅ Trust proxy for correct HTTPS detection (needed for Secure cookies on Render/Proxies)
app.set("trust proxy", 1);

// ✅ Allowed origins depending on environment
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://frontend-one-topaz-21.vercel.app", // Vercel frontend
        "https://spedilo-main.onrender.com",        // Backend itself
      ]
    : ["http://localhost:3000", "http://localhost:3001"];

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("Allowed origins:", allowedOrigins);

// ✅ CORS config
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    console.log("CORS origin check:", origin);

    if (!origin) {
      // allow requests with no origin (e.g., Postman, curl)
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log("✅ Origin allowed:", origin);
      return callback(null, origin); // must return the origin string
    } else {
      console.log("❌ Origin blocked:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow sending cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply CORS + handle preflight
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Middleware
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
