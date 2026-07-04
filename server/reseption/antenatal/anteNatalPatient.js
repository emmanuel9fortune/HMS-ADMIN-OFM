const express = require('express');
const router = express.Router();
const { Patient } = require('../../../model');

router.post('/', async(req, res) => {
    try {

        const { 
            center, 
            specialPoints, 
            sect, 
            tribe, 
            spousePhone, 
            subscribe, 
            nextOfKinAddress, 
            dateOfBooking, 
            occupation,
            educationLevel,
            nextOfKinPhone,
            maritalStatus,
            ageAtMarriage,
            LMP,
            eddByUss,
            eddDate,
            AverageMonthlyFamilyIncome, 
            uid,
        } = req.body

        const patientInfo = {
            center: center || '',
            tribe: tribe || '',
            spousePhone: spousePhone || '',
            subscribe: subscribe || '',
            nextOfKinAddress: nextOfKinAddress || '',
            dateOfBooking: dateOfBooking || '',
            sect: sect || '',
            specialPoints: specialPoints || '',
            occupation: occupation || '',
            educationLevel: educationLevel || '',
            nextOfKinPhone: nextOfKinPhone || '',
            maritalStatus: maritalStatus || '',
            ageAtMarriage: ageAtMarriage || '',
            LMP: LMP || '',
            eddByUss: eddByUss || '',
            eddDate: eddDate || '',
            AverageMonthlyFamilyIncome: AverageMonthlyFamilyIncome || '',
            uid: uid || '',
        };

        await Patient.updateOne(
            { _id: uid },
            patientInfo
        )

        res.json({status: 'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;