import express from "express";
import { registerUser, loginUser, getUserProfile, logoutUser } from "../controllers/authController.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", getUserProfile);
router.post("/logout", logoutUser);
export default router;
//# sourceMappingURL=authRoutes.js.map