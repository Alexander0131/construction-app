const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { clerkMiddleware } = require("@clerk/express");

const projectRoutes = require("./routes/projects.routes");
const configRoutes = require("./routes/config.routes");
const postRoutes = require("./routes/post.routes");
const viewCountRoutes = require("./routes/viewcount.routes");
const messageRoutes = require("./routes/sendMessage.route");

const app = express(); 

app.get("/api/debug-env", (_req, res) => {
  res.json({ clientUrl: process.env.CLIENT_URL });
});

const productionOrigin = process.env.CLIENT_URL; // e.g. https://construction-app.vercel.app

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin === productionOrigin ||
        /^https:\/\/construction-[a-z0-9]+-alexander-samuel-s-projects\.vercel\.app$/.test(origin)
      ) {
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

// Populates req.auth from the Clerk session token, when present.
app.use(clerkMiddleware());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  })
);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/projects", projectRoutes);
app.use("/api/config", configRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/count", viewCountRoutes);
app.use("/api/message", messageRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Centralized error handler - controllers can just `next(err)`.
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
