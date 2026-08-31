// UpdateReceipt

const express = require('express');
const router = express.Router();
const { billRequests, service } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const id = req.body.id
        const services = req.body.services 

        await billRequests.updateOne(
            {_id: id},
            {
                $set: {services: services}
            }
        )

        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;