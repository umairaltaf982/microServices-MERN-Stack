const mongoose = require('mongoose');
const Order = require('./models/Order');
require('dotenv').config();

// This is a placeholder for the user ID - you'll need to replace this with actual user IDs
// after creating users and getting their IDs from the auth service
const SAMPLE_USER_ID = '000000000000000000000000'; // This will be replaced with actual user IDs

// Sample order data
const orders = [
  {
    userId: SAMPLE_USER_ID,
    items: [
      {
        bookId: '000000000000000000000001', // Placeholder, will be replaced with actual book IDs
        title: 'The Great Gatsby',
        quantity: 2,
        price: 12.99
      },
      {
        bookId: '000000000000000000000002', // Placeholder, will be replaced with actual book IDs
        title: 'To Kill a Mockingbird',
        quantity: 1,
        price: 14.99
      }
    ],
    totalAmount: 40.97,
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    status: 'delivered',
    paymentMethod: 'credit_card',
    paymentStatus: 'completed',
    createdAt: new Date('2023-01-15')
  },
  {
    userId: SAMPLE_USER_ID,
    items: [
      {
        bookId: '000000000000000000000003', // Placeholder, will be replaced with actual book IDs
        title: 'The Hobbit',
        quantity: 1,
        price: 15.99
      }
    ],
    totalAmount: 15.99,
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    status: 'shipped',
    paymentMethod: 'paypal',
    paymentStatus: 'completed',
    createdAt: new Date('2023-02-20')
  }
];

// Note: This seed file is provided as a template, but it requires actual user and book IDs
// to work correctly. You should run this after seeding users and books, and update the IDs.
console.log('⚠️ IMPORTANT: This seed file contains placeholder IDs.');
console.log('Before running this script, please update the user and book IDs with actual values from your database.');
console.log('You can get these IDs after running the auth-service and book-service seed scripts.');

// Connect to MongoDB
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing orders
    await Order.deleteMany({});
    console.log('Deleted existing orders');

    // Check if we're using placeholder IDs
    if (SAMPLE_USER_ID === '000000000000000000000000') {
      console.log('\n⚠️ You are using placeholder IDs. This is just a demonstration.');
      console.log('In a real scenario, update the script with actual user and book IDs before running.');
      console.log('For now, we will create sample orders with these placeholder IDs for demonstration purposes.');
    }

    // Insert new orders
    await Order.insertMany(orders);
    console.log('Added sample orders to database');

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
