const express = require('express');
const router = express.Router();
const { staff, staffUpload } = require('../../model');

router.post('/',  staffUpload.single('img'), async(req, res) => {
    try {
        const value = JSON.parse(req.body.value);

        const name = value.name
        const title = value.title
        const passkey = value.passkey
        const photo = req.file.filename
        const dob = value.dob
        const address = value.address
        const phone = value.phone
        const nextOfKin = value.nextOfKin
        const nextOfKinPhone = value.nextOfKinPhone
        const email = value.email
        const state = value.state
        const lga = value.lga
        const nationality = value.nationality
        const qualifications = value.qualifications
        const referees = value.referees
        

        const findPasskey = await staff.findOne({passkey: value.passkey})
        if(findPasskey){
            return res.json({status:'failed', message:'Passkey Already Exist'}) 
        }else{
            
            await staff.create({
                name,
                title,
                passkey,
                photo,
                dob,
                address,
                phone,
                nextOfKin,
                nextOfKinPhone,
                email,
                state,
                lga,
                nationality,
                qualifications,
                referees,
            })

            return res.json({status:'success'})
        }

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;