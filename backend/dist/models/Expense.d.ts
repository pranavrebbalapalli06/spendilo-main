import mongoose, { Document } from "mongoose";
export interface IExpense extends Document {
    user: mongoose.Schema.Types.ObjectId;
    category: string;
    amount: number;
    date: Date;
    description: string;
}
declare const _default: mongoose.Model<IExpense, {}, {}, {}, mongoose.Document<unknown, {}, IExpense, {}, {}> & IExpense & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Expense.d.ts.map