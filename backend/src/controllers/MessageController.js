import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import cloudinary from "../utils/cloudinary.js";
import { getReceiverSocketId,io } from "../utils/socket.js";

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );

    res
      .status(200)
      .json({ success: true, message: "all users are fetch", data: users });
  } catch (error) {
    console.error("error on getUsersForSideBar", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to get the users " });
  }
};

export const getMessagesbyId = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user?._id;
    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    });

    res.status(200).json({
      success: true,
      message: "all messages are fetched",
      data: messages,
    });
  } catch (error) {
    console.error("error on getMessagesbyId", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to get the messages " });
  }
};



export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const senderId = req.user?._id; // Ensure req.user is properly populated
    const { id: receiverId } = req.params;

    // console.log("senderId:", senderId);
    // console.log("receiverId:", receiverId);

    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "Both senderId and receiverId are required.",
      });
    }

    let imageUrl = null;
    // console.log("image",image);
    
    if (image) {
      if (image.startsWith("data:image")) {
        // If the image is a base64 string, upload it directly
        const uploadResult = await cloudinary.uploader.upload(image, {
          resource_type: "auto", // Automatically detect the file type (e.g., image/png, image/jpeg)
        });
        imageUrl = uploadResult.secure_url; // Get the secure URL from Cloudinary
        console.log("Uploaded image URL:", imageUrl);
      } else {
        // If it's not base64, assume it's a URL or file path
        const uploadResult = await cloudinary.uploader.upload(image);
        imageUrl = uploadResult.secure_url; // Get the secure URL from Cloudinary
        console.log("Uploaded image URL:", imageUrl);
      }
    }

    const newMessage = new Message({
      senderId, // Ensure these field names match your schema
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      // console.log("New message sent to user:", receiverId);
    }

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error on sendMessage:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to send the message",
    });
  }
};
