const mongoose = require("mongoose");
const dns = require("dns");

/**
 * Connect to MongoDB database using MONGO_URI environment variable
 */
const connectDB = async () => {
  try {
    // Set reliable public DNS fallback for SRV record lookup on Windows environments
    try {
      dns.setServers(["8.8.8.8", "8.8.4.4"]);
    } catch (dnsErr) {
      // Ignore if environment overrides DNS configuration
    }

    const mongoURI =
  (process.env.MONGO_URI || process.env.MONGODB_URI || "").trim();

    if (!mongoURI) {
      throw new Error("MONGO_URI is undefined or empty in environment variables");
    }

    if (!mongoURI.startsWith("mongodb://") && !mongoURI.startsWith("mongodb+srv://")) {
      throw new Error('Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"');
    }

    const maskedURI = mongoURI.length > 15 
      ? mongoURI.substring(0, 15) + "..." 
      : mongoURI;
    console.log(`Connecting to MongoDB with URI: ${maskedURI}`);

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✓ Connected to MongoDB Atlas");
  } catch (error) {
    console.warn(`MongoDB Connection Notice: ${error.message} (Server running with active memory storage fallback)`);
  }
};

module.exports = connectDB;
