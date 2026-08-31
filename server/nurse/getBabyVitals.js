// getBabyVitals

const express = require('express');
const router = express.Router();
const { babyschem } = require('../../model');

router.post('/', async(req, res) => {
    try {

        const {
            uid,
        } = req.body

        const baby = await babyschem.findOne({uid: uid})
        
        res.json({status:'success', baby})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;