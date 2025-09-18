import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // save new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        return res.status(201).json({ message: "User registered successfully" });
    }
    catch (err) {
        console.error("Register Error:", err);
        return res.status(500).json({ message: "Failed to register" });
    }
};
export const getUserProfile = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({
            user: {
                name: user.name,
                email: user.email
            }
        });
    }
    catch (err) {
        console.error("Get Profile Error:", err);
        return res.status(401).json({ message: "Invalid token" });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // find user
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "User not found" });
        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });
        // generate token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1h" });
        return res.json({
            message: "Login successful",
            token,
            user: {
                name: user.name,
                email: user.email
            }
        });
    }
    catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({ message: "Login failed" });
    }
};
//# sourceMappingURL=authController.js.map