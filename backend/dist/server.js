import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./route/authRoutes.js";
import expenseRoutes from "./route/expenseRoutes.js";
dotenv.config();
const app = express();
// Middleware
app.use(cors());
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