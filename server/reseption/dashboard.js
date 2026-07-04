const express = require('express');
const router = express.Router();
const { Patient, staff, queue, billRequests, notifications } = require('../../model');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (user) => jwt.sign(user, 'f4cfe900c7ba051dfba3de09ad4c382f8eaa272948a9960fd6f169c7b2a0d95b', { expiresIn: '30d' });

router.post('/', async(req, res) => {
    try {
        const staffID = req.body.staffID
        const tokend = req.body.token

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const startTimestamp = startOfDay.getTime();
        const endTimestamp = endOfDay.getTime();

        const patientsTodayCount = await Patient.countDocuments({
            timeStamp: { $gte: startTimestamp, $lte: endTimestamp }
        });

        const latestPatient = await Patient.find().select('name phone timeStamp center status admittedTime hop family familyid _id').sort({_id: -1}).limit(7)

        const getSaff = await staff.findById({_id: staffID})

        const queued =  await queue.countDocuments({patientID: {$exists: true}})

        const getBills = await billRequests.find({status: 'PENDING'}).sort({timeStamp: -1}).select('uid staffID timeStamp _id').limit(10)
        const getnotification = await notifications.find({role:'cashier'}).limit(10)

        const combine = [...new Set([...getBills, ...getnotification])]

        const getID = queued?.length > 0 ? queued?.map((patient)=> patient?.patientID) : []
        const getID2 = combine?.length > 0 ? combine.map((patient)=> patient?.uid) : []
        const getID3 = getBills?.length > 0 ? getBills.map((patient)=> patient?.staffID) : []

        const combineID = [...new Set([... getID, ...getID2])]

        const getpatients = await Patient.find({_id: {$in: combineID}}).select('name phone timeStamp center status admittedTime _id').limit(7)
        const getstaffs = await staff.find({_id: {$in: getID3}}).select('name title _id')

        const token = jwt.sign({ userId: getSaff._id }, 'f4cfe900c7ba051dfba3de09ad4c382f8eaa272948a9960fd6f169c7b2a0d95b', { expiresIn: '1h' });

        const refreshToken = tokend;
        
        if (!refreshToken) return res.json({msg:'error getting refresh token', refreshToken});
        
        jwt.verify(refreshToken, "f4cfe900c7ba051dfba3de09ad4c382f8eaa272948a9960fd6f169c7b2a0d95b", (err, user) => {
            if (err) return res.json('error verifying refresh token');
        
            const newAccessToken = generateAccessToken({ id: getSaff._id });
            res.json({ status: 'success', patientsTodayCount, latestPatient, getSaff, key: token, accessToken: newAccessToken, queue: queued, getpatients, getBills: combine, getstaffs });
        });
        
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;