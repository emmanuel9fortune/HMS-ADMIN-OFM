const express = require('express');
const router = express.Router();
const { Patient, antenatal, patientdiagnos } = require('../model');
const mongoose = require('mongoose');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid

        if(uid){            
            const getPatient = await Patient.findOne({_id: uid})
            const getantenatal = await antenatal.findOne({uid: uid})
            
            const visists = await patientdiagnos.countDocuments({uid: uid})
            
            const getFamilyMembers = await Patient.find({familyid: uid})
            let getFamily = ''

            if(getPatient?.familyid){
                getFamily = await Patient.findOne({_id: getPatient?.familyid})  
            }          

            res.json({status:'success' , getPatient, getantenatal, visists, getFamilyMembers, getFamily})
        }else{
            res.json({status:'waiting' })
        }
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;