import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
        );
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not defined in environment variables");
        }
        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export { login };