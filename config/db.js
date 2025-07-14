const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Correct relative path
dotenv.config({ path: path.join(__dirname, "../config.env") });

const DB = process.env.MONGO_URI.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log("✅ DB connection successful!");
  } catch (err) {
    console.error("❌ DB connection unsuccessful");
    console.error(err.message);
    process.exit(1); // Optional: exit if DB fails
  }
};

module.exports = connectDB;
