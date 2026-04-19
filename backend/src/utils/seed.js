/**
 * Seed script — creates an ADMIN user
 * Run: node src/utils/seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ role: 'ADMIN' });
  if (existing) {
    console.log('Admin already exists:', existing.email);
    process.exit(0);
  }

  const admin = await User.create({
    name: 'Super Admin',
    email: 'admin@renthub.com',
    password: 'Admin@123',
    role: 'ADMIN',
  });

  console.log('Admin created:', admin.email, '/ password: Admin@123');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
