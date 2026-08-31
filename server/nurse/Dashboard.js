const express = require('express');
const router = express.Router();
const { notifications, Patient, staff, task, note } = require('../../model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (user) => jwt.sign(user, 'f4cfe900c7ba051dfba3de09ad4c382f8eaa272948a9960fd6f169c7b2a0d95b', { expiresIn: '30d' });

router.post('/', async(req, res) => {
    try {
        const staffID = req.body.staffID
        const tokend = req.body.token

        const getNotification = await notifications.find({role: 'nurse'}).sort({timeStamp: -1}).limit(10)

        const getPatientsID = getNotification?.length > 0 ? getNotification?.map((item)=> item?.uid) : []

        const getPatientDetails = await Patient.find({_id: {$in: getPatientsID}}).select('name status center hop family familyid _id')

        const getSaff = await staff.findOne({_id: staffID}).select('name title _id')

        const getSaffID = await staff.find({title: 'nurse'})

        const getSaffIDs = getSaffID?.length > 0 ? getSaffID?.map((item)=> item?._id) : []

        const gettask = await task.find({staffID: {$in: getSaffIDs}})

        const getnotes = await note.findOne({title:'nurse'})

        const token = jwt.sign({ userId: getSaff._id }, 'f4cfe900c7ba051dfba3de09ad4c382f8eaa272948a9960fd6f169c7b2a0d95b', { expiresIn: '1h' });

        const refreshToken = tokend;
        
        if (!refreshToken) return res.json({msg:'error getting refresh token', refreshToken});
        
        jwt.verify(refreshToken, "f4cfe900c7ba051dfba3de09ad4c382f8eaa272948a9960fd6f169c7b2a0d95b", (err, user) => {
            if (err) return res.json('error verifying refresh token');
        
            const newAccessToken = generateAccessToken({ id: getSaff._id });
            res.json({ status: 'success', getPatientDetails, getSaff, key: token, accessToken: newAccessToken, getNotification, getnotes, gettask });
        });
        
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;