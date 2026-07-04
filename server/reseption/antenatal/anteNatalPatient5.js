const express = require('express');
const router = express.Router();
const { antenatal} = require('../../../model');

router.post('/', async(req, res) => {
    try {

        const { 
            generalCondition,
            oedema,
            anaemia,
            respiratorySystem,
            cardiovascularSystem,
            abdomen,
            spleen,
            liver,
            preliminary,
            height, 
            weight,
            feet,
            inches,
            ST,
            LBS,
            BP,
            albumin,
            sugar,
            breastNipples,
            HB,
            RB,
            genotype,
            USS,
            bloodGroup,
            chestXray,
            uid
        } = req.body


        await antenatal.updateOne(
            { uid },
            {
                $set:{
                    generalCondition: generalCondition || '',
                    oedema: oedema || '',
                    anaemia: anaemia || '',
                    respiratorySystem: respiratorySystem || '',
                    cardiovascularSystem: cardiovascularSystem || '',
                    abdomen: abdomen || '',
                    spleen: spleen || '',
                    liver: liver || '',
                    height: height || '',
                    weight: weight || '',
                    BP: BP || '',
                    albumin: albumin || '',
                    sugar: sugar || '',
                    preliminary: preliminary || '',
                    HB: HB || '',
                    RH: RB || '',
                    genotype: genotype || '',
                    breastNipples: breastNipples || '',
                    USS: USS || '',
                    bloodGroup: bloodGroup || '',
                    chestXray: chestXray || '',
                    feet: feet || '',
                    inches: inches || '',
                    ST: ST || '',
                    LBS: LBS || '',
                }
            }
        );
        res.json({status:'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;