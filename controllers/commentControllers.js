const Comment = require("../models/commentModel");
const HttpError = require("../models/errorModel");
const Post = require("../models/postModel");

// Create a comment
const createComment = async (req, res, next) => {
  try {
    const { commentText } = req.body;
    const postId = req.params.id;
    const commenter = req.user.id;

    const newComment = await Comment.create({
      postId,
      commenter,
      commentText,
    });
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Failed to create comment.", 500));
  }
};

// Edit a comment
const editComment = async (req, res, next) => {
  try {
    const { commentText } = req.body;
    const commentId = req.params.commentId;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(new HttpError("Comment not found.", 404));
    }
    if (comment.commenter.toString() !== userId) {
      return next(
        new HttpError("You are not authorized to edit this comment.", 403)
      );
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { commentText },
      { new: true }
    );

    // Return the updated comment
    res.status(200).json(updatedComment);
  } catch (error) {
    return next(new HttpError("Failed to edit comment.", 500));
  }
};

// Delete a comment
const deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(new HttpError("Comment not found.", 404));
    }
    if (comment.commenter.toString() !== userId) {
      return next(
        new HttpError("You are not authorized to delete this comment.", 403)
      );
    }

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    return next(new HttpError("Failed to delete comment.", 500));
  }
};

module.exports = {
  createComment,
  editComment,
  deleteComment,
};
