const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// environment secret 
const JWT_SECRET = process.env.JWT_SECRET ;

// Register Controller
exports.register = async (req, res) => {
  try {
    const { userName, userEmail, password, role } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({
      userName,
      userEmail,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser._id,
        userName: newUser.userName,
        userEmail: newUser.userEmail,
        role: newUser.role,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Login Controller with JWT
exports.login = async (req, res) => {
  try {
    const { userEmail, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' } // You can adjust token duration
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token, // send token to client
      user: {
        id: user._id,
        userName: user.userName,
        userEmail: user.userEmail,
        role: user.role,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};