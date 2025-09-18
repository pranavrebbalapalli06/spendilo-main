import mongoose, { Document } from "mongoose";

export interface IExpense extends Document {
  user: mongoose.Schema.Types.ObjectId;
  category: string;
  amount: number;
  date: Date;
  description: string;
}

const expenseSchema = new mongoose.Schema<IExpense>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
});

export default mongoose.model<IExpense>("Expense", expenseSchema);
