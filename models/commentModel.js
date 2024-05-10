const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    commenter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentText: {
      type: String,
      required: true,
    },
  },
  { timeStamps: true }
);

module.exports = model("Comment", commentSchema);
