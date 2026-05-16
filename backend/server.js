const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/auth'))

// Hardcoded for now - we'll move to .env once server works
const MONGO_URI = "mongodb://dhroov1234:dhroov1234@ac-htz17xt-shard-00-00.2e8skzv.mongodb.net:27017,ac-htz17xt-shard-00-01.2e8skzv.mongodb.net:27017,ac-htz17xt-shard-00-02.2e8skzv.mongodb.net:27017/?ssl=true&replicaSet=atlas-l6nyei-shard-0&authSource=admin&appName=Cluster0"
const PORT = 5000

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => console.log('DB connection error:', err))