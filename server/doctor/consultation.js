// consultation

const express = require('express');
const router = express.Router();
const { billRequests, Patient } = require('../../model');
const { getIO } = require('../../socketManager');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid
        const staffID = req.body.staffID
        const price = Number(req.body.price)

        const patient = await Patient.findOne({_id: uid})

        await billRequests.create({
            uid,
            doctorID: staffID,
            services: JSON.stringify({items:[{name: 'Consultation', price:price, quantity: 1, totalPrice: price}] , totalPrice: price}),
            status: 'PENDING',
            type: 'consult',
            timeStamp : new Date().getTime()
        }) 
        

        const io = getIO()
        io.to("cashier").emit("message", `Patient ${patient?.name} Bill Sent !!`)
        io.to("receptionist").emit("message", `Patient ${patient?.name} Bill Sent !!`)
        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;