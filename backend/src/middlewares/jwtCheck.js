import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const jwtCheck = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User Not Found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("error on jwt check", error.message);
    res.status(500).json({ message: "Server Error" });
    return;
  }
};

export default jwtCheck;
