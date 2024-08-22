const { Router } = require("express");

const {
  createPost,
  getPosts,
  getPost,
  getCatPosts,
  getUserPosts,
  editPost,
  deletePost,
} = require("../controllers/postControllers");
const authMiddleWare = require("../middleware/authMiddleware");
const router = Router();

router.post("/", authMiddleWare, createPost);
router.get("/", getPosts);
router.get("/:id", getPost);
router.put("/:id", authMiddleWare, editPost);
router.get("/categories/:category", getCatPosts);
router.get("/users/:id", getUserPosts);
router.delete("/:id", authMiddleWare, deletePost);

module.exports = router;
