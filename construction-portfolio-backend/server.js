// require("dotenv").config();


require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { clerkMiddleware } = require("@clerk/express");

// const dns = require("dns");

// dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Routes
const projectRoutes = require("./src/routes/projects.routes");
const configRoutes = require("./src/routes/config.routes");
const postRoutes = require("./src/routes/post.routes");
const viewCountRoutes = require("./src/routes/viewcount.routes");
const messageRoutes = require("./src/routes/sendMessage.route");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

/* ---------------------------------------------------------- */
/* Environment Validation                                     */
/* ---------------------------------------------------------- */

if (!MONGO_URI) {
  console.error("❌ Missing required environment variable: MONGO_URI");
  process.exit(1);
}

/* ---------------------------------------------------------- */
/* Middleware                                                 */
/* ---------------------------------------------------------- */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://construction-app-umber.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  })
);

/* ---------------------------------------------------------- */
/* Utility Routes                                             */
/* ---------------------------------------------------------- */

app.get("/favicon.ico", (_req, res) => {
  res.status(204).end();
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy.",
  });
});

app.get("/api/debug-env", (_req, res) => {
  res.json({
    clientUrl: process.env.CLIENT_URL || null,
    nodeEnv: process.env.NODE_ENV || "development",
  });
});

/* ---------------------------------------------------------- */
/* API Routes                                                 */
/* ---------------------------------------------------------- */

app.use("/api/projects", projectRoutes);
app.use("/api/config", configRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/count", viewCountRoutes);
app.use("/api/message", messageRoutes);

/* ---------------------------------------------------------- */
/* 404 Handler                                                */
/* ---------------------------------------------------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.originalUrl}' not found.`,
  });
});

/* ---------------------------------------------------------- */
/* Global Error Handler                                       */
/* ---------------------------------------------------------- */

app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ---------------------------------------------------------- */
/* Start Server                                               */
/* ---------------------------------------------------------- */

async function startServer() {
  try {
    console.log("🚀 Starting server...");

    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB connected.");

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(
        `🌍 Environment: ${process.env.NODE_ENV || "development"}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server.");
    console.error(error);

    process.exit(1);
  }
}

/* ---------------------------------------------------------- */
/* Process Error Handling                                     */
/* ---------------------------------------------------------- */

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Promise Rejection");
  console.error(reason);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception");
  console.error(error);

  process.exit(1);
});

startServer();