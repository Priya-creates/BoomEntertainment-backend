const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRouter = require("./routes/userRoutes");
const videoRouter = require("./routes/videoRoutes");
const pingRouter = require("./routes/pingRoutes");

const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "/config.env") });

// Connect to MongoDB
connectDB();

const app = express();

// Security middleware
app.use(helmet());
app.use(hpp());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Allow only specific frontend domains
const allowedOrigins = [
  "http://localhost:3001",
  `https://${process.env.VERCEL_URL}`,
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 👇️ Remove this block if you're using Cloudinary instead of local uploads
// const uploadsPath = path.join(__dirname, "uploads");
// app.use(
//   "/uploads",
//   express.static(uploadsPath, {
//     setHeaders: (res) => {
//       res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
//     },
//   })
// );

// API routes
app.use("/api/user", userRouter);
app.use("/api/videos", videoRouter);
app.use("/api", pingRouter);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
