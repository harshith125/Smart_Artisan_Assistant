const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// REGISTER
router.post('/register', async (req, res) => {
  const { name, password } = req.body
  try {
    // Generate Artisan ID
    const artisanId = 'ART-' + Math.random().toString(36).substr(2, 6).toUpperCase()
    const email = `artisan_${Date.now()}@example.com`

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, artisanId, password: hashed, role: 'artisan' })
    res.status(201).json({ 
      message: 'Registered successfully. Await admin approval.',
      artisanId: user.artisanId
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body
  try {
    const user = await User.findOne({ 
      $or: [{ email: identifier }, { artisanId: identifier }] 
    })
    
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Invalid credentials' })

    if (user.status === 'pending') return res.status(403).json({ message: 'Account pending admin approval' })
    if (user.status === 'rejected') return res.status(403).json({ message: 'Account rejected' })

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: { id: user._id, name: user.name, artisanId: user.artisanId, email: user.email, role: user.role }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router