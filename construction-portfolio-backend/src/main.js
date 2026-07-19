require("dotenv").config();
// const dns = require("dns");

// dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("Missing MONGO_URI in environment. See .env.example.");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });