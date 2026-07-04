const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { labs } = require('../../model');

router.post('/', async (req, res) => {
  try {
    const { id, text, uid } = req.body;

    if (!id || !uid || !text) {
      return res.json({
        status: 'error',
        message: 'Missing required fields',
      });
    }

    const result = await labs.updateOne(
      {
        uid: new mongoose.Types.ObjectId(uid),
        'lab._id': new mongoose.Types.ObjectId(id),
      },
      {
        $set: {
          'lab.$.content': text,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.json({
        status: 'error',
        message: 'Lab result not found',
      });
    }

    return res.json({ status: 'success' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

module.exports = router;
