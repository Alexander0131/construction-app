require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { clerkMiddleware } = require("@clerk/express");

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Routes
const projectRoutes = require("./src/routes/projects.routes");
const configRoutes = require("./src/routes/config.routes");
const postRoutes = require("./src/routes/post.routes");
const viewCountRoutes = require("./src/routes/viewcount.routes");
const messageRoutes = require("./src/routes/sendMessage.route");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

/* Environment Validation*/

if (!MONGO_URI) {
  console.error("Missing required environment variable: MONGO_URI");
  process.exit(1);
}

/* Middleware */
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
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


/* API Routes*/

app.use("/api/projects", projectRoutes);
app.use("/api/config", configRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/count", viewCountRoutes);
app.use("/api/message", messageRoutes);


/* Start Server           */

async function startServer() {
  try {
    console.log("🚀 Starting server...");

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(
        `🌍 Environment: ${process.env.NODE_ENV || "development"}`
      );
    });
  } catch (error) {
    console.error("Failed to start server.");
    console.error(error);

    process.exit(1);
  }
}

startServer();