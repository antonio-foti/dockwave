
const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const router = express.Router();

// Use a default secret if not provided (for development only)
const JWT_SECRET = process.env.JWT_SECRET || 'default-dev-secret-change-in-production';

// Docker Hub login
router.post('/dockerhub/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Authenticate with Docker Hub
    const response = await axios.post('https://hub.docker.com/v2/users/login/', {
      username,
      password
    });
    
    const { token } = response.data;
    
    // Create our own JWT token
    const jwtToken = jwt.sign(
      { 
        username, 
        dockerhub_token: token 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      token: jwtToken,
      user: { username }
    });
    
  } catch (error) {
    console.error('Docker Hub auth error:', error.message);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Verify JWT token
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: { username: decoded.username } });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
