const express = require('express');
const axios = require('axios');
const storage = require('node-persist');
const cache = storage.create({ttl: 3600});
const router = express.Router();
require('dotenv').config();
const loggers = require('../utility/logger')

cache.init()

const EXTERNAL_API_URL = 'https://jsonplaceholder.typicode.com';

// Fetch weather data from external API
async function userDetails(id) {
  try {
    const response = await axios.get(`${EXTERNAL_API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from external API:', error);
    throw new Error('Error fetching data');
  }
}

// Route to get weather data
router.get('/users', loggers, async (req, res, next) => {
  const id = req.query.id || '1';
  const cacheKey = `weather_${id}`;

  // Check cache first
  const cachedData = await cache.getItem(cacheKey);
  if (cachedData) {
    console.log('Fetched from cache');
    return res.json(cachedData);
  }

  // Fetch from API if not cached
  try {
    const data = await userDetails(id);
    await cache.setItem(cacheKey, data);
    console.log('Fetched from API');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});

module.exports = router;

