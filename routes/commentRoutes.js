const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createComment,
  getCommentsForPost,
  editComment,
  deleteComment,
} = require("../controllers/commentControllers");

const router = Router();

// Create a comment
router.post("/:id/comments", authMiddleware, createComment);
// Edit a comment
router.patch("/comments/:commentId", authMiddleware, editComment);

// Delete a comment
router.delete("/comments/:commentId", authMiddleware, deleteComment);

module.exports = router;
