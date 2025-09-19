import jwt from "jsonwebtoken";
export const protect = (req, res, next) => {
    // Try to get token from cookie first, then from Authorization header
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token)
        return res.status(401).json({ msg: "No token, authorization denied" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};
//# sourceMappingURL=authMiddleware.js.map