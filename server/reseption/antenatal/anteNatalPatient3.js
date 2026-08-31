const express = require('express');
const router = express.Router();
const { antenatal } = require('../../../model');

router.post('/', async(req, res) => {
    try {

        const { 
            letter,
            specialInvestigation,
            uid
        } = req.body

        await antenatal.updateOne(
            { uid },
            {
                $set: {
                    letter: letter || '',
                    specialInvestigation: specialInvestigation || '',
                }
            }
        );
        res.json({status: 'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;