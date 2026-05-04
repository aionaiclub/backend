const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ override: true });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const createSuperAdmin = async () => {
  await connectDB();

  try {
    const adminExists = await User.findOne({ email: 'admin@aionai.club' });

    if (adminExists) {
      console.log('Super Admin already exists');
      process.exit();
    }

    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'admin@aionai.club',
      password: 'superpassword123', // Admin should change this after first login
      role: 'superadmin',
    });

    console.log(`Super Admin created: ${superAdmin.email}`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

createSuperAdmin();
