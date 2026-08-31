const express = require('express');
const router = express.Router();
const { staff } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const name = req.body.sname
        const title = req.body.dep
        const passkey = req.body.pass
        const id = req.body.id
        const dob = req.body.edob
        const address = req.body.eaddress
        const phone = req.body.ephone
        const nextOfKin = req.body.enextOfKin
        const nextOfKinPhone = req.body.enextOfKinPhone
        const email = req.body.eemail
        const state = req.body.estate
        const lga = req.body.elga
        const nationality = req.body.enationality
        const qualifications = req.body.equalifications
        const referees = req.body.ereferees

        

        await staff.updateOne(
            {_id: id},
            {
                name,
                title,
                passkey,
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
            }
        )

        return res.json({status:'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;