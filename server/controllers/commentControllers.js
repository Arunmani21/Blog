const Comment = require("../models/commentModel");
const HttpError = require("../models/errorModel");
const Post = require("../models/postModel");

//========= Create a Comment for a post
//POST : api/posts/:posts/comments
//PROTECTED
const createComment = async (req, res, next) => {
  try {
    const { commentText } = req.body;
    const postId = req.params.id;
    const commenter = req.user.id;

    // Create the comment
    const newComment = await Comment.create({
      postId,
      commenter,
      commentText,
    });

    // Populate the commenter's name before returning the response
    await newComment.populate("commenter", "name");

    // Add the comment to the post's comments array
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Failed to create comment.", 500));
  }
};

//========= Edit a Comment for a post
//PATCH : api/posts/comments/:id
//PROTECTED
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

    // Update the comment text
    comment.commentText = commentText;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    return next(new HttpError("Failed to edit comment.", 500));
  }
};

//========= Delete a Comment for a post
//DELETE : api/posts/comments/:id
//PROTECTED
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

    // Remove the comment from the post's comments array
    await Post.findByIdAndUpdate(comment.postId, {
      $pull: { comments: commentId },
    });

    // Delete the comment
    await comment.remove();

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
