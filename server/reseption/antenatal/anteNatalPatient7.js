const express = require('express');
const router = express.Router();
const { Patient } = require('../../../model');
const mongoose = require('mongoose');

router.post('/', async (req, res) => {
  try {
    const { uid, formFields } = req.body;

    if (!uid || !Array.isArray(formFields)) {
      return res.json({ status: 'error', message: 'Missing UID or formFields' });
    }

    const toUpdate = formFields.filter(item => item?._id);
    const toAdd = formFields.filter(item => !item?._id);

    // Update existing records
    for (const item of toUpdate) {
      await Patient.updateOne(
        { _id: uid, 'anteNatalRecords._id': item._id },
        { $set: { 'anteNatalRecords.$': item } }
      );
    }

    // Add new records
    if (toAdd.length > 0) {
      const enriched = toAdd.map(item => ({ ...item, _id: new mongoose.Types.ObjectId() }));

      await Patient.updateOne(
        { _id: uid },
        { $push: { anteNatalRecords: { $each: enriched } } }
      );
    }

    return res.json({ status: 'success' });
  } catch (error) {
    console.error(error);
    res.json({ status: 'error', message: error.message });
  }
});

module.exports = router;
