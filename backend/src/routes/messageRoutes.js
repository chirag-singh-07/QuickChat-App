import express from "express";
import jwtCheck from "../middlewares/jwtCheck.js";
import {
  getMessagesbyId,
  getUsersForSideBar,
  sendMessage,
} from "../controllers/MessageController.js";

const router = express.Router();

// Route to fetch all users

router.get("/users", jwtCheck, getUsersForSideBar);
router.get("/:id", jwtCheck, getMessagesbyId);
router.post("/send/:id",jwtCheck,sendMessage)

export default router;
