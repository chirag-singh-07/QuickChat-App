import express from "express";
import {
  checkAuth,
  handleLoginUser,
  handleLogoutUser,
  handleSignUpUser,
  handleUpdateProfile,
} from "../controllers/AuthController.js";
import jwtCheck from "../middlewares/jwtCheck.js";

const router = express.Router();

router.post("/signup", handleSignUpUser);
router.post("/login", handleLoginUser);
router.post("/logout", handleLogoutUser);

router.put("/update-profile", jwtCheck, handleUpdateProfile);
router.get("/check", jwtCheck, checkAuth);

export default router;
