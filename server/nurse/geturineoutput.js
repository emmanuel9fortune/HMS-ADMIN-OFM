const express = require('express');
const router = express.Router();
const { urineschem } = require('../../model');

router.post('/', async(req, res) => {
    try {

        const {
            uid,
        } = req.body

        const urine = await urineschem.findOne({uid: uid})
        
        res.json({status:'success', urine})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;