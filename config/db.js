const mongoose = require("mongoose");
const dotenv = require("dotenv");


dotenv.config({ path: "./server/config.env" });

const DB = process.env.MONGO_URI.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

const connectDB = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ DB connection successful!");
  } catch (err) {
    console.log("❌ DB connection unsuccessful");
    console.error(err.message);
  }
};

module.exports = connectDB;
