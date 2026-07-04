import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export let isMongoDBConnected = false;

export async function connectDB() {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.warn("⚠️ MONGODB_URI is not defined in environment variables.");
    console.log("ℹ️ Switching to local JSON-based fallback database for contact submissions.");
    isMongoDBConnected = false;
    return;
  }

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoDBConnected = true;
    console.log("🚀 Connected to MongoDB successfully!");
  } catch (err: any) {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("ℹ️ Gracefully falling back to local JSON-based database for preview mode.");
    isMongoDBConnected = false;
  }
}
