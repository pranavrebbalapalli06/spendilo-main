import Expense from "../models/Expense.js";
export const addExpense = async (req, res) => {
    try {
        const { category, amount, date, description } = req.body;
        const expense = new Expense({ user: req.user.id, category, amount, date, description });
        await expense.save();
        res.json(expense);
    }
    catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};
export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id });
        res.json(expenses);
    }
    catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};
export const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(expense);
    }
    catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};
export const deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ msg: "Expense Deleted" });
    }
    catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};
//# sourceMappingURL=expenseController.js.map