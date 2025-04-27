const express = require('express');
const router = express.Router();
const User = require('../models/User');
const requireAuth = require('../middleware/authMiddleware');

// GET /api/users - fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

router.post('/', async (req, res) => {
    try {
      const { userName, userEmail, password, role } = req.body;
  
      // Basic validation
      if (!userName || !userEmail || !password || !role) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required',
        });
      }
  
      // Create and save the user
      const newUser = new User({ userName, userEmail, password, role });
      const savedUser = await newUser.save();
  
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: savedUser,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message,
      });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message,
      });
    }
  });

// GET /api/users/me - protected route
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;