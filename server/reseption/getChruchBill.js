const express = require('express');
const router = express.Router();
const { churchBill } = require('../../model');

router.post('/', async(req, res) => {
    try {

        const church = await churchBill.find()
        
        return res.json({status:'success', church})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;