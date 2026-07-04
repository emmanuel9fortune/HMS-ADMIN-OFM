const express = require('express');
const router = express.Router();
const { serve } = require('../../model');

router.post('/', async (req, res) => {
  try {
    const searchQuery = req.body.search?.trim();

    if (!searchQuery) {
      return res.status(400).json({ status: 'error', message: 'Search query cannot be empty' });
    }

    const utils = await serve.find({
      name: { $regex: searchQuery, $options: 'i' },
      type: { $in: ['test', 'scan'] }
    }).limit(50);
 
    res.json({ status: 'success', utils });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

module.exports = router;
