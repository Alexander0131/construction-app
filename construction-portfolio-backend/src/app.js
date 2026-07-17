const express = require("express");
// const cors = require("cors");  // commented out temporarily for debugging
const fileUpload = require("express-fileupload");
const { clerkMiddleware } = require("@clerk/express");

const projectRoutes = require("./routes/projects.routes");
const configRoutes = require("./routes/config.routes");
const postRoutes = require("./routes/post.routes");
const viewCountRoutes = require("./routes/viewcount.routes");
const messageRoutes = require("./routes/sendMessage.route");

const app = express(); 

/* app.get("/api/debug-env", (_req, res) => {
  res.json({ clientUrl: process.env.CLIENT_URL });
});

const allowedOrigins = [
  "http://localhost:`5173", // Web frontend
  "https://construction-mat0unysk-alexander-samuel-s-projects.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, Postman)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },

    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
*/


app.use(cors())


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 10 * 1024 * 1024 },
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

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;