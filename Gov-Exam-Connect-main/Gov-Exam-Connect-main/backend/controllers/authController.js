const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/User");

// Generate JWT Token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is missing.");
  }

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

// Register User
const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
