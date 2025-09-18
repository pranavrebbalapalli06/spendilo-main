import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
export declare const addExpense: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getExpenses: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateExpense: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteExpense: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=expenseController.d.ts.map