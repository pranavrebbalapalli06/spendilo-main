import mongoose, { Document } from "mongoose";
const expenseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String },
});
export default mongoose.model("Expense", expenseSchema);
//# sourceMappingURL=Expense.js.map