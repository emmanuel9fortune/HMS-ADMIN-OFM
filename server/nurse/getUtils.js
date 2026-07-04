const express = require('express');
const router = express.Router();
const { util } = require('../../model');

router.post('/', async(req, res) => {
    try {

        const utils = await util.find({
            type:'utils'
        }).limit(15)
        const consumable = await util.find({
            type: 'consumable'
        }).limit(15)

        return res.json({status:'success', utils, consumable})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;