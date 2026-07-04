const express = require('express');
const router = express.Router();
const { antenatal} = require('../../../model');

router.post('/', async(req, res) => {
    try {

        const { 
            urinarySymptoms,
            historyPreg,
            vomiting,
            vaginalDischarge,
            swellingOfAnkles,
            bleeding,
            otherSymptoms,
            uid
        } = req.body


        await antenatal.updateOne(
            { uid },
            {
                $set: {
                    urinarySymptoms: urinarySymptoms || '',
                    historyPreg: historyPreg || '',
                    vomiting: vomiting || '',
                    vaginalDischarge: vaginalDischarge || '',
                    swellingOfAnkles: swellingOfAnkles || '',
                    bleeding: bleeding || '',
                    otherSymptoms: otherSymptoms || '',
                }
            }
        );
        
        res.json({status:'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;