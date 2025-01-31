import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generataToken } from "../utils/generateToken.js";
import cloudinary from "../utils/cloudinary.js";

export const handleSignUpUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate input
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existsUser = await User.findOne({ email });
    if (existsUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create new user
    const user = new User({ fullName, email, password: hashedPassword });

    if (user) {
      generataToken(user._id, res);
      await user.save();
      return res.status(201).json({
        success: true,
        message: "User signed up successfully",
        data: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          profilePic: user.profilePic,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Error saving user",
      });
    }
  } catch (error) {
    console.error("Error signing up user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error signing up user" });
  }
};

export const handleLoginUser = async (req, res) => {
  // Implement user logout logic here

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if password matches

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    if (user) {
      generataToken(user._id, res);
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          profilePic: user.profilePic,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error logging out user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error logging out user" });
  }
};

export const handleLogoutUser = (req, res) => {
  try {
    // Implement user logout logic here
    res.clearCookie("token", "", { maxAge: 0 });
    return res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error logging out user" });
  }
};

export const handleUpdateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { profilePic } = req.body;

    // Validate input
    if (!profilePic) {
      return res
        .status(400)
        .json({ success: false, message: "Profile picture is required" });
    }

    // Check if user exists
    const uploader = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploader.secure_url,
      },
      {
        new: true,
      }
    );

    if (updatedUser) {
      return res.status(200).json({
        success: true,
        message: "User profile updated successfully",
        data: {
          _id: updatedUser._id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          profilePic: updatedUser.profilePic,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error updating user profile" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error checking authentication:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error checking authentication" });
  }
};
