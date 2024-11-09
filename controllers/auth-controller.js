const user = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register endpoint
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const checkExistingUser = await user.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists with the same username or email. Please try with a different username or email.",
      });
    }

    // Hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user in the database
    const newlyCreatedUser = new user({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newlyCreatedUser.save();

    // Generate JWT token
    const accessToken = jwt.sign(
      {
        userId: newlyCreatedUser._id,
        username: newlyCreatedUser.username,
        role: newlyCreatedUser.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );

    // Send response with access token
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred! Please try again",
    });
  }
};

// Login endpoint
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const foundUser = await user.findOne({ username });
    if (!foundUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Check if password matches
    const isPasswordMatch = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      {
        userId: foundUser._id,
        username: foundUser.username,
        role: foundUser.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );

    // Send response with access token
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      accessToken,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred! Please try again",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { oldPassword, newPassword } = req.body;
    // Find the current logged in user
    const foundUser = await user.findById(userId);
    if (!foundUser) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }
    // Check if the old password is correct
    const isPasswordMatch = await bcrypt.compare(oldPassword, foundUser.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: 'Old password is not correct! please try again',
      });
    }
    // Hash the new password here
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);
    foundUser.password = newHashedPassword;
    await foundUser.save();
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred! Please try again",
    });
  }
};

module.exports = { loginUser, registerUser, changePassword };
