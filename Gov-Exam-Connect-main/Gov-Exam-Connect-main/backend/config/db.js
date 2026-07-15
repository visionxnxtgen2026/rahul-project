const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Check if MONGO_URI exists
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined.");
    }

    // Prevent multiple connections (useful for Vercel)
    if (mongoose.connection.readyState === 1) {
      console.log("✅ MongoDB already connected");
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error");
    console.error(error.message);

    // Don't exit on Vercel
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }

    throw error;
  }
};

module.exports = connectDB;
