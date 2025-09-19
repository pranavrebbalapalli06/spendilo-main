import express from "express";
import dotenv from "dotenv";
import cors, { type CorsOptions } from "cors"; // ✅ import type
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./route/authRoutes.js";
import expenseRoutes from "./route/expenseRoutes.js";

dotenv.config();

const app = express();

// ✅ Trust proxy for secure cookies (Render/Proxies)
app.set("trust proxy", 1);

// ✅ Allowed origins
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://frontend-one-topaz-21.vercel.app", // Vercel frontend
        "https://spedilo-main.onrender.com",        // Backend
      ]
    : ["http://localhost:3000", "http://localhost:3001"];

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("Allowed origins:", allowedOrigins);

// ✅ CORS config
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    console.log("CORS origin check:", origin);

    if (!origin) return callback(null, true); // allow Postman/curl

    if (allowedOrigins.includes(origin)) {
      console.log("✅ Origin allowed:", origin);
      return callback(null, origin); // reflect allowed origin
    } else {
      console.log("❌ Origin blocked:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply CORS + preflight
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ✅ Force headers middleware (fixes '*' issue)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
});

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
