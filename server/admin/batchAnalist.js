const express = require('express');
const router = express.Router();
const { util } = require('../../model');
const jwt = require('jsonwebtoken');
require('dotenv').config();


router.post('/', async(req, res) => {
    try {

        const batch = req.body.batch

        const analytics = await util.aggregate([
            {
                $match:{
                    batch: batch
                }
            },
            {
                $project: {
                amountMade: {
                    $multiply: [
                    "$sellingPrice",
                    { $subtract: ["$originalQuantity", "$quantity"] }
                    ]
                },
                actualAmount: {
                    $multiply: [
                    "$originalPrice",
                    { $subtract: ["$originalQuantity", "$quantity"] }
                    ]
                },
                originalQuantity: 1,
                quantity: 1
                }
            },
            {
                $group: {
                _id: null,
                totalOriginalQuantity: { $sum: "$originalQuantity" },
                totalQuantity: { $sum: "$quantity" },
                totalAmount: { $sum: "$amountMade" },
                totalActualAmount: { $sum: "$actualAmount" }
                }
            }
            ])

        
            
        res.json({ status: 'success', analytics });
        
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;