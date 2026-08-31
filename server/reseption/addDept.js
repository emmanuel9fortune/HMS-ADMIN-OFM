const express = require('express');
const router = express.Router();
const { Patient } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid
        const deposit = req.body.deposit

        await Patient.updateOne(
            {_id: uid},
            {$set: {deposit: deposit} }
        )
        
        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;