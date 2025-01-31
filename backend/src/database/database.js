import mongoose from "mongoose";

const connectDB = () => {
  try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected...");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  }
};

export default connectDB;
