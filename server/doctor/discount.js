
const express = require('express');
const router = express.Router();
const { Patient } = require('../../model');
const { getIO } = require('../../socketManager');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid
        const discount = req.body.discount
        const oid = req.body.oid

        await Patient.updateOne(
            {_id: uid},
            {
                discount
            }
        )
       
        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;