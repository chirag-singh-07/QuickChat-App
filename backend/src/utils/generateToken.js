import jwt from "jsonwebtoken";

export const generataToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_KEY, {
    expiresIn: "7h",
  });
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    secure: process.env.NODE_ENV !== "development", // Set to true if using HTTPS
    sameSite: "strict",
  });
  return token;
};
