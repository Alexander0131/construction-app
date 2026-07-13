const express = require("express");
const requireAdmin = require("../middleware/requireAdmin");
const {
  createPost,
  getPosts,
  getSinglePost,
  updatePost,
  deletePost,
  countPosts,
  getLimitedPosts,
} = require("../controllers/post.controller");

const router = express.Router();

// Public reads
router.get("/post", getPosts);
router.get("/limited", getLimitedPosts);
router.get("/single/:id", getSinglePost);
router.get("/count", countPosts);

// Admin-only writes
router.post("/create-post", requireAdmin, createPost);
router.patch("/posts/:postId", requireAdmin, updatePost);
router.delete("/:id", requireAdmin, deletePost);

module.exports = router;
