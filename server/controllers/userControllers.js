const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const User = require("../models/userModel");
const HttpError = require("../models/errorModel");

// ======== Register a new user
// POST : api/users/register
//UNPROTECTED

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;
    if (!name || !email || !password) {
      return next(new HttpError("Fill all the feilds.", 422));
    }

    const newEmail = email.toLowerCase();

    const emailExists = await User.findOne({ email: newEmail });

    if (emailExists) {
      return next(new HttpError("Email already Exists.", 422));
    }

    if (password.trim().length < 6) {
      return next(
        new HttpError("Password should be atleast 6 characters.", 422)
      );
    }

    if (password != password2) {
      return next(new HttpError("Password do not match.", 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: newEmail,
      password: hashedPass,
    });

    res.status(201).json(newUser);
  } catch (error) {
    return next(new HttpError("User registration failed.", 422));
  }
};

// ======== Login for a registered user
// POST : api/users/login
//UNPROTECTED

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new HttpError("Fill all feilds", 422));
    }

    const newEmail = email.toLowerCase();

    const user = await User.findOne({ email: newEmail });
    if (!user) {
      return next(new HttpError("Invalid Credentials.", 422));
    }

    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return next(new HttpError("Invalid Credentials.", 422));
    }

    const { _id: id, name } = user;
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, id, name });
  } catch (error) {
    return next(
      new HttpError("login failed. please check your credentials.", 422)
    );
  }
};

// ======== User Profile
// POST : api/users/:id
//PROTECTED

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return next(new HttpError("User Not Found", 404));
    }
    res.status(200).json(user);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ======== Edit User Avatar
// POST : api/users/change-avatar
//PROTECTED
const changeAvatar = async (req, res, next) => {
  try {
    if (!req.files || !req.files.avatar) {
      return next(new HttpError("Please choose an image", 422));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) => {
        if (err) {
          console.log(err); // Log the error for debugging purposes
        }
      });
    }

    const { avatar } = req.files;

    if (avatar.size > 500000) {
      return next(
        new HttpError("Profile picture too big. Should be less than 500KB", 422)
      );
    }

    const fileNameParts = avatar.name.split(".");
    const newFileName =
      fileNameParts[0] + uuid() + "." + fileNameParts[fileNameParts.length - 1];

    const uploadPath = path.join(__dirname, "..", "uploads", newFileName);

    // Move the file using a Promise-based approach
    await avatar.mv(uploadPath);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: newFileName },
      { new: true }
    );

    if (!updatedUser) {
      return next(new HttpError("Avatar couldn't be changed", 422));
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    return next(
      new HttpError("Something went wrong, please try again later", 500)
    );
  }
};

// ======== Edit User details
// POST : api/users/edit-user
//PROTECTED
const editUser = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword, confirmPassword } =
      req.body;

    if (!name || !email || !currentPassword || !newPassword) {
      return next(new HttpError("Fill in all Fields"));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("user not found.", 404));
    }

    const emailExist = await User.findOne({ email });
    if (emailExist && emailExist._id != req.user.id) {
      return next(new HttpError("Email already exists.", 422));
    }

    const validatePassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!validatePassword) {
      return next(new HttpError("Invalid Current password.", 422));
    }

    if (newPassword != confirmPassword) {
      return next(new HttpError("new passwords are not match"));
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    const newInfo = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, password: hash },
      { new: true }
    );

    res.status(200).json(newInfo);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ======== Get Authors
// POST : api/users/authors
//UNPROTECTED

const getAuthors = async (req, res, next) => {
  try {
    const authors = await User.find().select("-password");
    res.json(authors);
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
};
