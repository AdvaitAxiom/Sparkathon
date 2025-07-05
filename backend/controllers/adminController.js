
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Nutrition = require('../models/NutritionScore');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)) || user.role !== 'admin') {
    return res.status(401).json({ message: 'Not an admin' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
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

exports.createProduct = async (req, res) => {
  try {
    const input = req.body;

    if (Array.isArray(input)) {

      const products = await Product.insertMany(input);
      res.status(201).json({ message: 'Products added successfully', products });
    } else {

      const product = await Product.create(input);
      res.status(201).json({ message: 'Product added successfully', product });
    }
  } catch (error) {
    console.error("Product Creation Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
};

exports.uploadNutrition = async (req, res) => {
  const nutrition = await Nutrition.create(req.body);
  res.json(nutrition);
};
// to add inventory in bulk
exports.bulkAddInventory = async (req, res) => {
  try {
    const inventoryItems = req.body;

    const results = await Inventory.insertMany(inventoryItems);

    res.status(201).json({
      message: 'Bulk inventory added successfully',
      data: results
    });
  } catch (err) {
    res.status(500).json({
      message: 'Bulk insert failed',
      error: err.message
    });
  }
};


exports.updateInventory = async (req, res) => {
  const inventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(inventory);
};

//to add inventory one after one
exports.createInventory = async (req, res) => {
  const inventory = await Inventory.create(req.body);
  res.json(inventory);
};

