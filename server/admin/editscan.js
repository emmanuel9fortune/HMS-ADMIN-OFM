const express = require('express');
const router = express.Router();
const { scans } = require('../../model');

router.post('/', async(req, res) => {
    try {
        
        const id = req.body.id
        const text = req.body.text
        const uid = req.body.uid

        await scans.updateOne(
            {
                uid: uid,
                "scan._id": id
            },
            {
                $set:{
                    "scan.$.results": text
                }
            }
        )

        return res.json({status:'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;    