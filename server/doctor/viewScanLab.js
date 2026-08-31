const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { labs, scans, staff, Patient } = require('../../model');

router.post('/', async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ status: 'error', message: 'UID is required' });
    }

    // Fetch all lab/scan records for the UID
    const [getlabs, getscan, patient] = await Promise.all([
      labs.find({ uid }),
      scans.find({ uid }),
      Patient.findOne({ _id: uid }).select('name address dateOfBirth sex phone _id'),
    ]);

    // Extract all lab and scan entries from all documents
    const allLabEntries = getlabs.flatMap(doc => doc.lab || []);
    const allScanEntries = getscan.flatMap(doc => doc.scan || []);

    const labDoctors = allLabEntries.map(item => item?.doctorID).filter(Boolean);
    const scanDoctors = allScanEntries.map(item => item?.doctorID).filter(Boolean);

    const labIDs = allLabEntries.map(item => item?.labID).filter(Boolean);
    const scanIDs = allScanEntries.map(item => item?.scanID).filter(Boolean);

    const combinedIDs = [...new Set([...labDoctors, ...scanDoctors, ...labIDs, ...scanIDs])]
      .filter(Boolean)
      .map(id => new mongoose.Types.ObjectId(id));

    const staffs = await staff.find({ _id: { $in: combinedIDs } });

    res.json({
      status: 'success',
      getlabs,
      getscan,
      staffs,
      patient,
    });

  } catch (error) {
    console.error('Error in /viewScanLab:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
