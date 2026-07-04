const express = require('express');
const router = express.Router();
const { antenatal} = require('../../../model');

router.post('/', async(req, res) => {
    try {

        const { 
            comments,
            pelvicAssessment,
            uid
        } = req.body

        await antenatal.updateOne(
            { uid },
            {
                $set:{
                    comments: comments || '',
                    pelvicAssessment: pelvicAssessment || '',
                }
            }
        );
        res.json({status:'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;