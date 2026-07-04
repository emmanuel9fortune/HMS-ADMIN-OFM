const express = require('express');
const router = express.Router();
const { medications } = require('../../model');

router.post('/', async(req, res) => {
    try {

        const {
            uid,
        } = req.body

        const medication = await medications.findOne({uid})

        const result = await medications.aggregate([
            {
                $project:{
                    size: {$bsonSize: "$$ROOT"}
                }
            }
        ])
        
        res.json({status:'success', medication, result})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;