const express = require('express');
const router = express.Router();
const { prescribes, Patient, staff, util, notifications } = require('../../model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (user) => jwt.sign(user, 'f4cfe900c7ba051dfba3de09ad4c382f8eaa272948a9960fd6f169c7b2a0d95b', { expiresIn: '30d' });

router.post('/', async(req, res) => {
    try { 
        const staffID = req.body.staffID
        const tokend = req.body.token

        const getNotification = await notifications.find({role: 'pharmacy', tag:'PAID'}).sort({timeStamp: -1}).limit(10)

        const getPatientsID = getNotification?.length > 0 ? getNotification?.map((item)=> item?.uid) : []

        const getPatientDetails = await Patient.find({_id: {$in: getPatientsID}}).select('name phone center family familyid _id')

        const getSaff = await staff.findOne({_id: staffID}).select('name title _id')
         
        const now = Math.floor(new Date("2025-09-08T00:00:00Z").getTime() / 1000);
        
        const utils = await util.aggregate([ 
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

        const getutilID = utils?.map((item)=> item?._id) || []
 
        const getBatches = await util.distinct('batch')

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

        const token = jwt.sign({ userId: getSaff._id }, 'f4cfe900c7ba051dfba3de09ad4c382f8eaa272948a9960fd6f169c7b2a0d95b', { expiresIn: '1h' });

        const refreshToken = tokend;
        
        if (!refreshToken) return res.json({msg:'error getting refresh token', refreshToken});
        
        jwt.verify(refreshToken, "f4cfe900c7ba051dfba3de09ad4c382f8eaa272948a9960fd6f169c7b2a0d95b", (err, user) => {
            if (err) return res.json('error verifying refresh token');
        
            const newAccessToken = generateAccessToken({ id: getSaff._id });
            res.json({ status: 'success', getPatientDetails, getSaff, key: token, accessToken: newAccessToken, utils, getnotifications: getNotification, utilsQty, getBatches });
        });
        
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;