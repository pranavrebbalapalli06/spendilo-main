import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./route/authRoutes.js";
import expenseRoutes from "./route/expenseRoutes.js";
dotenv.config();
const app = express();
// CORS configuration for deployment
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? true // Allow all origins in production for now
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};
// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ DB Connection Error:", err));
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map