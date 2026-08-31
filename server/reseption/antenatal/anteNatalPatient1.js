const express = require('express');
const router = express.Router();
const { Patient} = require('../../../model');

router.post('/', async(req, res) => {
    try {

        const { 
            heartDisease, 
            kidneyDisease, 
            Diabetes, 
            ChestDisease, 
            Covid, 
            PreviousePregnancies, 
            NoOfLivingChildren,
            NumberOfOperations,
            uid
        } = req.body

        const patientInfo = {
            Diabetes: Diabetes || '',
            ChestDisease: ChestDisease || '',
            Covid: Covid || '',
            PreviousePregnancies: PreviousePregnancies || '',
            kidneyDisease: kidneyDisease || '',
            heartDisease: heartDisease || '',
            NoOfLivingChildren: NoOfLivingChildren || '',
            NumberOfOperations: NumberOfOperations || '',
        };

        await Patient.updateOne(
            { _id: uid },
            patientInfo,
        );

        res.json({status: 'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;