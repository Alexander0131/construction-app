const express = require("express");
const requireAdmin = require("../middleware/requireAdmin");
// const {
//   getProjects,
//   createProject,
//   getSingleProjects,
//   updateProject,
//   deleteProject,
// } = require("../controllers/projects.controller");

const router = express.Router();

// // Public reads
// router.get("/", getProjects);
// router.get("/:id", getSingleProjects);

// // Admin-only writes
// router.post("/", requireAdmin, createProject);
// router.patch("/:projectId", requireAdmin, updateProject);
// router.delete("/:id", requireAdmin, deleteProject);

module.exports = router;
