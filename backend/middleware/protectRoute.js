import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized- no token provided." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ status: "fail", error: "Unauthorized- invalid token." });
    }
    // console.log(decoded);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ status: "fail", error: "User not found." });
    }
    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message || "Internal server error",
    });
  }
};

export default protectRoute;
