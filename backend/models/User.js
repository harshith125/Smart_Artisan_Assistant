const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, unique: true, sparse: true },
  artisanId: { type: String, unique: true, sparse: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['artisan', 'accountant', 'admin'], default: 'artisan' },
  status:    { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)