const express = require('express');
const router = express.Router();
const { util } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const utils = await util.find().sort({expireDate: -1}).limit(20)
        return res.json({status:'success', utils})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});
 
module.exports = router;