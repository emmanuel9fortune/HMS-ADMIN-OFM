const express = require('express');
const router = express.Router();
const { util } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const name = req.body.name
        const quantity = req.body.quantity
        const date = req.body.date
        const expireDate = req.body.expireDate
        const originalPrice = req.body.originalPrice
        const sellingPrice = req.body.sellingPrice
        const batch = req.body.batch
        const limit = req.body.limit
        const explimit = req.body.explimit
        const type = req.body.type
        const clas = req.body.clas

        await util.create({
            name,
            quantity,
            originalQuantity: quantity,
            date,
            expireDate,
            originalPrice,
            sellingPrice,
            batch,
            limit,
            explimit,
            type,
            class: clas,
        })

        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;