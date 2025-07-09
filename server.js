const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRouter = require("./routes/userRoutes");
const videoRouter = require("./routes/videoRoutes");

const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");


dotenv.config({ path: path.join(__dirname, "/config.env") });


connectDB();


const app = express();


app.use(helmet());
app.use(hpp());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);


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


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const uploadsPath = path.join(__dirname, "uploads");
app.use(
  "/uploads",
  express.static(uploadsPath, {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

app.use("/api/user", userRouter);
app.use("/api/videos", videoRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
