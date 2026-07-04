// getClinicalNote

const express = require('express');
const router = express.Router();
const { clinicalnotes, staff } = require('../../model');

router.post('/', async (req, res) => {
    try {
        const { uid } = req.body;
        
        const gettingNote = await clinicalnotes.findOne({ uid });

        const getstaffs = gettingNote?.clinicalnote?.map((item)=> item.staffID)

        const getStaffDetails = await staff.find({_id: {$in: getstaffs}}).select('name staffID')
        
        return res.json({ status:'success', gettingNote, getStaffDetails });
    } catch (error) {
        (error)
        res.json({ message: 'Internal server error' });
    }
});

module.exports = router;