const express = require('express');
const router = express.Router();
const { subscribes, cards } = require('../../model');

router.post('/', async(req, res) => {
    try {

        const subscribe = await subscribes.find().limit(20)
        const card = await cards.findOne({id: "admin"})

        return res.json({status:'success', diagnosis: subscribe, cards: card})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;