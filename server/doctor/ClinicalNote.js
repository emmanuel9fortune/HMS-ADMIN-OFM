// routes/ClinicalNote.js

const express = require('express');
const router = express.Router();
const { clinicalnotes } = require('../../model');

router.post('/', async (req, res) => {
  try {
    const { uid, staffid, note } = req.body;

    if (!uid || !staffid || !note) {
      return res.json({ message: 'uid, staffid, and note are required' });
    }

    const formFields = {
      date: Date.now(),
      note,
      staffID: staffid,
    };

    const existingNote = await clinicalnotes.findOne({ uid });

    if (existingNote) {
      // Check if this staff already has a note
      const staffNote = await clinicalnotes.findOne({
        uid,
        "clinicalnote.staffID": staffid,
      });

      if (staffNote) {
        // Update this staff's existing note
        await clinicalnotes.updateOne(
          { uid, "clinicalnote.staffID": staffid },
          {
            $set: {
              "clinicalnote.$": formFields,
            },
          }
        );
      } else {
        // Add new staff note to the array
        await clinicalnotes.updateOne(
          { uid },
          {
            $push: { clinicalnote: formFields },
          }
        );
      }

      return res.json({ status:'success', message: 'Note updated successfully' });

    } else {
      // Create a new clinicalnotes document
      await clinicalnotes.create({
        uid,
        clinicalnote: [formFields],
      });

      return res.json({ status:'success', message: 'Note created successfully' });
    }
  } catch (error) {
    console.error('Error saving clinical note:', error);
    res.json({ message: 'Internal server error' });
  }
});

module.exports = router;
