const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  posts: { type: Number, default: 0 },
  comments: { type: Schema.Types.ObjectId, ref: "Comment" },
});

module.exports = model("user", userSchema);
