const axios = require('axios');
require('dotenv').config();

const auth = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token by making a request to the auth service
    const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/auth/me`, {
      headers: {
        'x-auth-token': token
      }
    });

    req.user = response.data;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
