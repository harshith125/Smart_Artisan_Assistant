const express = require('express');
const router = express.Router();
const Production = require('../models/Production');

// @route   POST /api/artisan/productions
// @desc    Add a new production
// @access  Public (temporarily for MVP)
router.post('/productions', async (req, res) => {
  try {
    const { itemName, category, description, materials, basePrice } = req.body;

    const newProduction = new Production({
      itemName,
      category,
      description,
      materials,
      price: parseFloat(basePrice) || 0
    });

    const savedProduction = await newProduction.save();
    
    // Send back formatted data to match frontend expectations
    res.status(201).json({
      id: savedProduction._id,
      item: savedProduction.itemName,
      date: savedProduction.dateAdded.toISOString().split('T')[0],
      price: `₹${savedProduction.price}`
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/artisan/productions
// @desc    Get all productions
// @access  Public (temporarily for MVP)
router.get('/productions', async (req, res) => {
  try {
    // Sort by date added (newest first)
    const productions = await Production.find().sort({ dateAdded: -1 });
    
    // Format them to match the frontend expectations
    const formatted = productions.map(p => ({
      id: p._id,
      item: p.itemName,
      category: p.category,
      materials: p.materials,
      date: p.dateAdded.toISOString().split('T')[0],
      price: `₹${p.price}`
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
