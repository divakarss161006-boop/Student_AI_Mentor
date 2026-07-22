const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");

/**
 * Generate JWT Token
 * @param {string} id - User ID
 * @returns {string} JWT Token
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "default_jwt_secret_key_123",
    {
      expiresIn: "30d",
    }
  );
};

/**
 * @desc    Register a new user & create student profile
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    console.log("--> Register Request Received:", req.body?.email);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      });
    }

    // Email format validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Password criteria validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters and include an uppercase letter, lowercase letter, number, and special character.",
      });
    }

    console.log("--> Register: Checking Database for Existing Email:", email.toLowerCase());
    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    console.log("--> Register: Creating User Record in MongoDB");
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    });

    if (user) {
      await Student.create({
        user: user._id,
        name: user.name,
        email: user.email,
      });

      console.log("--> Register: Generating JWT Token");
      const token = generateToken(user._id);

      console.log("<-- Register Response Sent Success for:", user.email);
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid user data provided",
      });
    }
  } catch (error) {
    console.error("Register Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during registration: " + error.message,
    });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    console.log("--> Login Request Received for Email:", req.body?.email);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    console.log("--> Login: Database Lookup for Email:", email.toLowerCase());
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      console.warn("--> Login Failed: User not found for email:", email);
      return res.status(404).json({
        success: false,
        message: "No account found with this email address.",
      });
    }

    console.log("--> Login: Comparing Hashed Password");
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.warn("--> Login Failed: Incorrect Password for email:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid password provided.",
      });
    }

    console.log("--> Login: Generating JWT Token");
    const token = generateToken(user._id);

    console.log("<-- Login Response Sent Successfully for User:", user.email);
    return res.json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during login: " + error.message,
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    return res.json({
      success: true,
      message: "User profile fetched successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("GetMe Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching user profile: " + error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
