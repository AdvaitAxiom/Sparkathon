const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  
  // Generate token for the newly registered user
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  
  // Return both token and user data (excluding password)
  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    preferences: user.preferences
  };
  
  res.json({ token, user: userData });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  
  // Return both token and user data (excluding password)
  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    preferences: user.preferences
  };
  
  res.json({ token, user: userData });
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, preferences } = req.body;
    
    // Find user by ID from the token
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user fields
    user.name = name || user.name;
    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences
      };
    }
    
    // Save updated user
    await user.save();
    
    // Return updated user data (excluding password)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferences: user.preferences
    };
    
    res.json({ user: userData });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user by ID from the token
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);
    
    // Update password
    user.password = hashed;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ message: 'Failed to update password' });
  }
};