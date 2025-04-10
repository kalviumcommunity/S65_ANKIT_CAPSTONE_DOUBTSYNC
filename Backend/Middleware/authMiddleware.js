const jwt = require("jsonwebtoken");
const userModel = require("../Models/userSchema");

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Authentication token is required." });
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid or expired token." });
        }

        const user = await userModel.findById(decodedToken.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User associated with token not found." });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

module.exports = authenticate;
