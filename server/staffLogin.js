const express = require('express');
const router = express.Router();
const { staff } = require('../model');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const generateAccessToken = (user) => jwt.sign(user, "f4cfe900c7ba051dfba3de09ad4c382f8eaa272948a9960fd6f169c7b2a0d85b", { expiresIn: '30d' });
const generateRefreshToken = (user) => jwt.sign(user, "f4cfe900c7ba051dfba3de09ad4c382f8eaa272948a9960fd6f169c7b2a0d95b", { expiresIn: '30d' });

router.post('/', async(req, res) => {
    try {

        const passkey = req.body.passkey

        const pass = String(passkey)
        const verify = await staff.findOne({passkey: pass}).select('name photo loginTimeStamp title _id')

        if(!verify){
            return res.json({status:'error', message:'Staff not found'})
        }
 
        await staff.updateOne(
            {passkey},
            {
                loginTimeStamp: new Date().getTime(),
                status: 'Active'
            }
        )

        
        const accessToken = generateAccessToken({ id: verify?._id, role: verify?.title });
        const refreshToken = generateRefreshToken({ id: verify?._id, role: verify?.title });

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite:'lax' });
        res.json({status:'success' , verify, accessToken, refreshToken})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;