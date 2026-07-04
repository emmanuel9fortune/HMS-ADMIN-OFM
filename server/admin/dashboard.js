const express = require('express');
const router = express.Router();
const { util, Patient, staff, billRequests } = require('../../model');
const jwt = require('jsonwebtoken');
require('dotenv').config();


router.post('/', async(req, res) => {
    try {

        const getutilsCount = await util.countDocuments()

        const getPatientCount = await Patient.countDocuments()

        const getSaff = await staff.find({status: 'Active'}).select('name title status _id')

        const TotalInvoice = await billRequests.countDocuments({status: 'PAID'})

        const now = Math.floor(new Date("2025-09-08T00:00:00Z").getTime() / 1000);

        const stocksExpire  =  await util.aggregate([
        // Filter documents where limit exists and is not null
        { 
            $match: {
            limit: { $ne: null, $exists: true }
            }
        },
        // Convert expireDate string to number safely
        {
            $addFields: {
            expireDateNum: {
                $convert: {
                input: "$expireDate",
                to: "long",
                onError: null,
                onNull: null
                }
            }
            }
        },
        // Ensure expireDateNum is valid and apply the alert condition
        {
            $match: {
            expireDateNum: { $ne: null },
            $expr: {
                $gte: [
                { $add: [now, { $multiply: ["$explimit", 86400] }] },
                "$expireDateNum"
                ]
            }
            }
        }
        ]);

        const getutilID = stocksExpire?.map(item => item?._id) || [];

        const utilsQty = await util.aggregate([
            {
                $match: {
                    limit: { $ne: null, $exists: true },
                    _id: { $nin: getutilID } // exclude IDs from stocksExpire
                }
            },
            {
                $addFields: {
                    meetsLimit: { $lte: ["$quantity", "$limit"] }
                }
            },
            {
                $match: { meetsLimit: true }
            },
            {
                $sort: { quantity: -1 }
            }
        ]);

        
 
        const getBatches = await util.distinct('batch')
        const analytics = await util.aggregate([
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
            
        res.json({ status: 'success', getPatientCount, getSaff, getutilsCount, TotalInvoice, stocksExpire, getBatches, analytics, utilsQty });
        
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;