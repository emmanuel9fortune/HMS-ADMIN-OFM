const express = require('express');
const router = express.Router();
const { Patient } = require('../../../model');
const mongoose = require('mongoose');

router.post('/', async (req, res) => {
  try {
    const { uid, formFields } = req.body;

    if (!uid || !formFields) {
      return res.status(400).json({ status: 'error', message: 'Missing data' });
    }

    // Convert all _id to ObjectId and enrich if missing
    const enrichedFields = formFields.map(item => {
      return {
        ...item,
        _id: mongoose.Types.ObjectId.isValid(item._id)
          ? new mongoose.Types.ObjectId(item._id)
          : new mongoose.Types.ObjectId(),
      };
    });

    // Get current operations _id from DB
    const patient = await Patient.findById(uid, { operations: 1 });

    const existingIds = new Set(
      patient.operations.map(op => op._id.toString())
    );

    const toUpdate = enrichedFields.filter(item =>
      existingIds.has(item._id.toString())
    );

    const toAdd = enrichedFields.filter(item =>
      !existingIds.has(item._id.toString())
    );

    // Update existing
    for (const item of toUpdate) {
      await Patient.updateOne(
        { _id: uid, 'operations._id': item._id },
        { $set: { 'operations.$': item } }
      );
    }

    // Add new
    if (toAdd.length > 0) {
      await Patient.updateOne(
        { _id: uid },
        { $push: { operations: { $each: toAdd } } }
      );
    }

    res.json({ status: 'success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
