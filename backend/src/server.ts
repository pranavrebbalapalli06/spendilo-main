import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./route/authRoutes.js";
import expenseRoutes from "./route/expenseRoutes.js";

dotenv.config();

const app = express();

// Trust proxy for correct HTTPS detection (required for secure cookies on Render/Proxies)
app.set('trust proxy', 1);

// CORS configuration for deployment
console.log('NODE_ENV:', process.env.NODE_ENV);

const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      'https://frontend-one-topaz-21.vercel.app',
      'https://spedilo-main.onrender.com'
    ]
  : ['http://localhost:3000', 'http://localhost:3001'];

console.log('Allowed origins:', allowedOrigins);

const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    console.log('CORS origin check:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('Origin blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Add logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  console.log('CORS allowed origins:', allowedOrigins);
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    origin: req.headers.origin 
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
