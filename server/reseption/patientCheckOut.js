// patientCheckOut
const express = require('express');
const router = express.Router();
const { billRequests, Patient, request, notifications } = require('../../model');
const { getIO } = require('../../socketManager');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid
        const billId = req.body.billId
        const mode = req.body.mode
        const getUtils = req.body.getUtils
        const type = req.body.type
        const staff = req.body.staff
 
        const getID = await billRequests.findOne({uid, _id:billId })
        await request.updateOne(
            {_id: getID?.approve},
            {$set: {status: 'AWAITING'}}
        )

        if(getID?.slag){
            await billRequests.updateOne({uid, _id:billId },{status:'AWAITING', mode, timeStamp: new Date().getTime(), tag:'PAID', staff})
        }else{
            if(type === 'nurse'){
                if(getUtils === 'utils'){
                    await billRequests.updateOne({uid, _id:billId },{status:'PAID', mode, timeStamp: new Date().getTime(), tag:'PAID', staff})
                }else if(getID?.tagged === 'PAID'){
                    await billRequests.updateOne({uid, _id:billId },{status:'PAID', mode, timeStamp: new Date().getTime(), tag:'PAID', staff})
                }else{
                    await billRequests.updateOne({uid, _id:billId },{status:'AWAITING', mode, timeStamp: new Date().getTime(), tag:'PAID', staff})
                }
            }else if(type === 'doctor'){
                if(getID?.tagged === 'PAID'){
                    await billRequests.updateOne({uid, _id:billId },{status:'PAID', mode, timeStamp: new Date().getTime(), tag:'PAID', staff})
                }else{
                    await billRequests.updateOne({uid, _id:billId },{status:'AWAITING', mode, timeStamp: new Date().getTime(), tag:'PAID', staff})
                }
            }else{
                await billRequests.updateOne({uid, _id:billId },{status:'PAID', mode, timeStamp: new Date().getTime(), tag:'PAID', staff})
            }
        } 


        const getpatientName = await  Patient.findOne({_id:uid})
        const io = getIO()
        if(type === 'doctor'){
            io.to("pharmacy").emit("message", `Patient ${getpatientName?.name} Prescription Sent !!`)
        }
        if(type === 'nurse' && getUtils !== 'utils'){
            io.to("pharmacy").emit("message", `Patient ${getpatientName?.name} Consumables Approved !!`)
        }
        if(type === 'lab' || type === 'scan'){
            io.to("laboratory").emit("message", `Patient ${getpatientName?.name} Bill Sent !!`)
        }

        if(type === 'doctor'){
            const notify =  await notifications.findOne({uid})

            if(notify){
                await notifications.updateOne(
                    {uid: uid}, 
                    {$set: {
                        role: 'pharmacy',
                        type: 'New Requests',
                        message: `Prescriptions for`,
                        timeStamp : new Date().getTime(),
                        tag:'PAID'
                    }}
                )
            }else{
                await notifications.create({
                    uid: uid,
                    role: 'pharmacy',
                    type: 'New Requests',
                    message: `Prescriptions for`,
                    timeStamp : new Date().getTime(),
                    tag:'PAID'
                })
            }
        }else if(type === 'nurse' && getUtils !== 'utils'){
            const notify =  await notifications.findOne({uid})

            if(notify){
                await notifications.updateOne(
                    {uid: uid},
                    {$set: {
                        role: 'pharmacy',
                        type: 'New Requests',
                        message: `Consumables for`,
                        timeStamp : new Date().getTime(),
                        tag:'PAID'
                    }}
                )
            }else{
                await notifications.create({
                    uid: uid,
                    role: 'pharmacy',
                    type: 'New Requests',
                    message: `Consumables for`,
                    timeStamp : new Date().getTime(),
                    tag:'PAID'
                })
            }
        }
        

        return res.json({status:'success'}) 

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;