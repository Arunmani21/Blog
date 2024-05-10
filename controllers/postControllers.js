const Post = require("../models/postModel");
const User = require("../models/userModel");
const HttpError = require("../models/errorModel");
const { getCommentsForPost } = require("../controllers/commentControllers");
//========= Create a post
//POST : api/posts
//PROTECTED
const createPost = async (req, res, next) => {
  try {
    let { title, category, description } = req.body;
    if ((!title, !category, !description)) {
      return next(new HttpError("Fill all Fields"));
    }
    const newPost = await Post.create({
      title,
      category,
      description,
      creator: req.user.id,
    });
    if (!newPost) {
      return next(new HttpError("Post couldn't be created.", 422));
    }
    const currentUser = await User.findById(req.user.id);
    const userPostCount = currentUser.posts + 1;
    await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });

    res.status(201).json(newPost);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//========= Get all posts
//GET : api/posts
//PROTECTED
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//========= Get single post
//GET : api/posts/:id
//PROTECTED
const getPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Number of comments per page
    const startIndex = (page - 1) * limit;

    const post = await Post.findById(postId)
      .populate({
        path: "comments",
        options: {
          limit: limit,
          skip: startIndex,
        },
      })
      .exec();

    if (!post) {
      return next(new HttpError("Post not found.", 404));
    }

    const totalComments = post.comments.length;
    const totalPages = Math.ceil(totalComments / limit);

    res.status(200).json({ post, totalPages });
  } catch (error) {
    return next(new HttpError(error));
  }
};

//========= Get Posts by Category
//GET : api/posts/categories/:category
//PROTECTED
const getCatPosts = async (req, res, next) => {
  try {
    const { category } = req.params;
    const catPosts = await Post.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(catPosts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//========= Get Author Post
//GET : api/posts/users/:id
//PROTECTED
const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//========= Edit Post
//GET : api/posts/:id
//PROTECTED
const editPost = async (req, res, next) => {
  try {
    let updatedPost;
    const postId = req.params.id;
    let { title, category, description } = req.body;

    if (!title || !category || description.length < 12) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    const oldPost = await Post.findById(postId);
    if (req.user.id == oldPost.creator) {
      updatedPost = await Post.findByIdAndUpdate(postId, {
        title,
        category,
        description,
      });
    }
    if (!updatedPost) {
      return next(new HttpError("couldn't update the post"));
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//=========Delete a Post
//GET : api/posts/:id
//PROTECTED
const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return next(new HttpError("Post Unavailable", 400));
    }
    const post = await Post.findById(postId);

    if (req.user.id == post.creator) {
      await Post.findByIdAndDelete(postId);
      const currentUser = await User.findById(req.user.id);
      const userPostCount = currentUser.posts - 1;
      await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
    } else {
      return next(new HttpError("Post Couldn't deleted"));
    }
    res.json(`Post ${postId} deleted successfully`);
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getCatPosts,
  getUserPosts,
  editPost,
  deletePost,
};
