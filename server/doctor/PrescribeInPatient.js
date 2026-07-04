// PrescribeInPatient

const express = require('express');
const router = express.Router();
const { prescribes, util, notifications, Patient } = require('../../model');
const { getIO } = require('../../socketManager');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid
        const instruction = req.body.instruction
        const doctorID = req.body.doctorID
        const cartItems = req.body.items
        const oid = req.body.oid

        const getOpenedPrescription = await prescribes.findOne({uid, status:'open'})

        if(getOpenedPrescription){
            {
                instruction ?
                    await prescribes.updateOne(
                        { _id: getOpenedPrescription?._id }, 
                        { 
                            $push: {prescribe : cartItems, instruction: instruction }
                        },
                    ) 
                :
                await prescribes.updateOne(
                    { _id: getOpenedPrescription?._id },
                    { 
                        $push: {prescribe : cartItems }
                    },
                )
            }
 
            for(let item of cartItems ){
                await util.findOneAndUpdate(
                    {
                        _id: item.id
                    },
                    {
                        $inc:{quantity: -item.quantity}
                    }
                )
            }
        }else{
            await prescribes.create({
                uid,
                instruction,
                doctorID, 
                timeStamp: new Date().getTime(), 
                status: 'open',
                tag: 'cashier',
                prescribe: cartItems,
                oid,
            })

            for(let item of cartItems ){
                await util.findOneAndUpdate(
                    {
                        _id: item.id
                    },
                    {
                        $inc:{quantity: -item.quantity}
                    }
                )

            }
        }
        
        const getpatientName = await  Patient.findOne({_id:uid})
        const io = getIO()
        io.to("cashier").emit("message", `Patient ${getpatientName?.name} Drug Request Sent !!`)
        io.to("receptionist").emit("message", `Patient ${getpatientName?.name} Drug Request Sent !!`)

        const notify =  await notifications.findOne({uid})

        if(notify){
            await notifications.updateOne(
                {uid: uid},
                {$set: {
                    role: 'cashier',
                    type: 'New Requests',
                    message: `Doctor Request for`,
                    timeStamp : new Date().getTime()
                }}
            )
        }else{
            await notifications.create({
                uid: uid,
                role: 'cashier',
                type: 'New Requests',
                message: `Doctor Request for`,
                timeStamp : new Date().getTime()
            })
        }

        
        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;