const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
require('dotenv').config();

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }
    
    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      try {
        // Get book details from book service
        const bookResponse = await axios.get(`${process.env.BOOK_SERVICE_URL}/api/books/${item.bookId}`);
        const book = bookResponse.data;
        
        // Check if book exists and has enough stock
        if (!book) {
          return res.status(404).json({ message: `Book with ID ${item.bookId} not found` });
        }
        
        if (book.stock < item.quantity) {
          return res.status(400).json({ 
            message: `Not enough stock for "${book.title}". Available: ${book.stock}, Requested: ${item.quantity}` 
          });
        }
        
        // Add to order items
        orderItems.push({
          bookId: book._id,
          title: book.title,
          quantity: item.quantity,
          price: book.price
        });
        
        // Add to total
        totalAmount += book.price * item.quantity;
      } catch (error) {
        console.error('Error fetching book details:', error.message);
        return res.status(500).json({ message: 'Error validating order items' });
      }
    }
    
    // Create new order
    const newOrder = new Order({
      userId: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod
    });
    
    const savedOrder = await newOrder.save();
    
    // Update book stock (in a real app, this should be in a transaction)
    for (const item of items) {
      try {
        await axios.put(
          `${process.env.BOOK_SERVICE_URL}/api/books/${item.bookId}`,
          { stock: { $inc: -item.quantity } },
          {
            headers: {
              'x-auth-token': req.header('x-auth-token'),
              'Content-Type': 'application/json'
            }
          }
        );
      } catch (error) {
        console.error('Error updating book stock:', error.message);
        // In a real app, you would implement a rollback mechanism here
      }
    }
    
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Order creation error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/orders
// @desc    Get all orders for the current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the order belongs to the current user or if user is admin
    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/orders/:id
// @desc    Update order status
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update orders' });
    }
    
    const { status, paymentStatus } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update order fields
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET /api/orders/admin/all
// @desc    Get all orders (admin only)
// @access  Private (Admin only)
router.get('/admin/all', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view all orders' });
    }
    
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
