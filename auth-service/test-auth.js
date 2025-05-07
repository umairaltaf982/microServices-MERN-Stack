const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const testAuth = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete test user if exists
    await User.deleteOne({ email: 'test@example.com' });
    console.log('Deleted existing test user if any');

    // Create a test user with a known password
    const password = 'test123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user'
    });
    
    await user.save();
    console.log('Created test user with email: test@example.com and password: test123');
    
    // Test password comparison
    const testUser = await User.findOne({ email: 'test@example.com' });
    console.log('Retrieved test user:', testUser ? 'Yes' : 'No');
    
    // Test with correct password
    const correctMatch = await testUser.comparePassword('test123');
    console.log('Correct password match:', correctMatch);
    
    // Test with incorrect password
    const incorrectMatch = await testUser.comparePassword('wrongpassword');
    console.log('Incorrect password match:', incorrectMatch);
    
    console.log('Test completed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testAuth();
