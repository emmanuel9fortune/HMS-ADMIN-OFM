// EditUtils

const express = require('express');
const router = express.Router();
const { util, billRequests, prescribes } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const name = req.body.name
        const quantity = req.body.quantity 

        await util.updateOne(
            {name},
            {$inc : {quantity: quantity}}
        )

        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

router.post('/EditBill', async(req, res) => {
    try {
        const id = req.body.id
        const status = req.body.status 

        await billRequests.updateOne(
            {_id: id},
            {$set : {status: status}}
        )

        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

router.post('/EditInBill', async(req, res) => {
    try {
        const status = req.body.status
        const id = req.body.id

        await billRequests.updateOne(
            {_id: id},
            {$set : {status: status}}
        )

        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;