const express = require("express");
const { check } = require("express-validator");
const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const router = express.Router();

/**
 * Health Check
 * GET /api/auth
 */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth API is running 🚀",
  });
});

/**
 * Register User
 * POST /api/auth/register
 */
router.post(
  "/register",
  [
    check("name", "Name is required").trim().notEmpty(),
    check("email", "Please provide a valid email").isEmail().normalizeEmail(),
    check(
      "password",
      "Password must be at least 6 characters"
    ).isLength({ min: 6 }),
  ],
  registerUser
);

/**
 * Login User
 * POST /api/auth/login
 */
router.post(
  "/login",
  [
    check("email", "Please provide a valid email").isEmail().normalizeEmail(),
    check("password", "Password is required").notEmpty(),
  ],
  loginUser
);

module.exports = router;
