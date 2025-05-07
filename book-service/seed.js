const mongoose = require('mongoose');
const Book = require('./models/Book');
require('dotenv').config();

// Sample book data
const books = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A story of wealth, love, and the American Dream in the 1920s.',
    price: 12.99,
    isbn: '9780743273565',
    category: 'Fiction',
    coverImage: 'https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg',
    stock: 25
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A powerful story of growing up amid racial injustice in the American South.',
    price: 14.99,
    isbn: '9780061120084',
    category: 'Fiction',
    coverImage: 'https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg',
    stock: 18
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    description: 'The adventure of Bilbo Baggins in Middle-earth.',
    price: 15.99,
    isbn: '9780547928227',
    category: 'Fantasy',
    coverImage: 'https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg',
    stock: 30
  },
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J.K. Rowling',
    description: 'The first book in the Harry Potter series.',
    price: 16.99,
    isbn: '9780590353427',
    category: 'Fantasy',
    coverImage: 'https://m.media-amazon.com/images/I/81iqZ2HHD-L._AC_UF1000,1000_QL80_.jpg',
    stock: 40
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    description: 'A classic novel about teenage angst and alienation.',
    price: 13.99,
    isbn: '9780316769488',
    category: 'Fiction',
    coverImage: 'https://m.media-amazon.com/images/I/61fgOuZfBGL._AC_UF1000,1000_QL80_.jpg',
    stock: 15
  },
  {
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian novel set in a totalitarian society.',
    price: 11.99,
    isbn: '9780451524935',
    category: 'Science Fiction',
    coverImage: 'https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg',
    stock: 22
  },
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    description: 'An epic fantasy trilogy that follows the quest to destroy the One Ring.',
    price: 29.99,
    isbn: '9780618640157',
    category: 'Fantasy',
    coverImage: 'https://m.media-amazon.com/images/I/71jLBXtWJWL._AC_UF1000,1000_QL80_.jpg',
    stock: 12
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A romantic novel of manners set in early 19th-century England.',
    price: 9.99,
    isbn: '9780141439518',
    category: 'Romance',
    coverImage: 'https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg',
    stock: 20
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    description: 'A philosophical novel about following your dreams.',
    price: 10.99,
    isbn: '9780062315007',
    category: 'Fiction',
    coverImage: 'https://m.media-amazon.com/images/I/71zHDXu1TlL._AC_UF1000,1000_QL80_.jpg',
    stock: 35
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    description: 'A dystopian novel set in a futuristic World State.',
    price: 12.99,
    isbn: '9780060850524',
    category: 'Science Fiction',
    coverImage: 'https://m.media-amazon.com/images/I/81zE42gT3xL._AC_UF1000,1000_QL80_.jpg',
    stock: 18
  }
];

// Connect to MongoDB
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing books
    await Book.deleteMany({});
    console.log('Deleted existing books');

    // Insert new books
    await Book.insertMany(books);
    console.log('Added sample books to database');

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
