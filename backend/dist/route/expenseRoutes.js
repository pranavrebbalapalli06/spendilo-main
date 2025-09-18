import { Router } from "express";
import { addExpense, getExpenses, updateExpense, deleteExpense } from "../controllers/expenseController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = Router();
router.post("/", protect, addExpense);
router.get("/", protect, getExpenses);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);
export default router;
//# sourceMappingURL=expenseRoutes.js.map