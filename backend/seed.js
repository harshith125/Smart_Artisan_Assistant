require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = "mongodb://dhroov1234:dhroov1234@ac-htz17xt-shard-00-00.2e8skzv.mongodb.net:27017,ac-htz17xt-shard-00-01.2e8skzv.mongodb.net:27017,ac-htz17xt-shard-00-02.2e8skzv.mongodb.net:27017/?ssl=true&replicaSet=atlas-l6nyei-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(MONGO_URI).then(async () => {
  const hashed = await bcrypt.hash('admin123', 10);
  await User.findOneAndUpdate(
    { email: 'admin@test.com' },
    { name: 'Admin User', email: 'admin@test.com', password: hashed, role: 'admin', status: 'approved' },
    { upsert: true }
  );
  console.log('Admin user created: admin@test.com / admin123');
  process.exit();
});
