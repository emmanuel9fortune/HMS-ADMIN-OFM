// inpatientBill

const express = require('express');
const router = express.Router();
const { billRequests, Patient, notifications, prescribes } = require('../../model');
const { getIO } = require('../../socketManager');
// const BillRequest = require('../model/BillRequest');
// const BillRequestItem = require('../model/BillRequestItem');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid
        const id = req.body.id
        const docID = req.body.docID
        const services = req.body.services
        const oid = req.body.oid

        const calculatedItems = services.map(item => {
            const quantity = Number(item.quantity) || 1;
            const unitPrice = Number(item.price) || 0;

            const totalPrice =
                Number(item.totalPrice) ||
                (unitPrice * quantity);

            const actualCost =
                Number(item.actualPrice) || 0;

            return {
                itemId: item.id || null,

                name: item.drugs || item.name,

                quantity,

                unitPrice,

                totalPrice,

                costPrice: Number(item.oprice) || 0,

                actualCost,

                days: item.days || null,

                dosage: item.dosage || null,

                frequency: item.time || null,

                status: item.status || null,

                time: item.time || null,

                sourceType: 'doctor'
            };
        });

        const total = calculatedItems.reduce(
            (sum, item) => sum + item.totalPrice,
            0
        );

        const actualCost = calculatedItems.reduce(
            (sum, item) => sum + item.actualCost,
            0
        );

        const profit = total - actualCost;

        // const bill = await BillRequest.create({
        //     patient: {
        //         uid
        //     },

        //     patientType: 'inpatient',

        //     type: 'doctor',

        //     staff: {
        //         doctorId: docID
        //     },

        //     payment: {
        //         status: 'UNPAID'
        //     },

        //     workflow: {
        //         currentDepartment: 'cashier',
        //         nextDepartment: 'cashier',
        //         stage: 'AWAITING_PAYMENT'
        //     },

        //     financials: {
        //         total,
        //         actualCost,
        //         profit,

        //         calculatedTotal: total,
        //         calculatedCost: actualCost,
        //         calculatedProfit: profit,

        //         totalDifference: 0,
        //         hasMismatch: false
        //     },

        //     billDate: new Date(),
        //     preTime: new Date()
        // });

        // await BillRequestItem.insertMany(
        //     services.map(item => ({
        //         billRequestId: bill._id,

        //         itemId: item.id,

        //         name: item.drugs || item.name,

        //         quantity: item.quantity || 1,

        //         unitPrice: item.price || 0,

        //         totalPrice: item.totalPrice || (
        //             (item.price || 0) * (item.quantity || 1)
        //         ),

        //         costPrice: item.oprice || 0,

        //         actualCost: item.actualPrice || 0,

        //         days: item.days || null,

        //         dosage: item.dosage || null,

        //         frequency: item.time || null,

        //         status: item.status || null,

        //         time: item.time || null,

        //         sourceType: 'doctor'
        //     }))
        // );

        if(docID){
            await billRequests.create({
                uid,
                doctorID: docID,
                services,
                status: 'AWAITING',
                type: 'doctor',
                timeStamp : new Date().getTime(),
                preTime: new Date().getTime(),
                id,
                oid,
            }) 
        }else{ 
            await billRequests.updateOne(
                {_id:id, uid},
                {$set:{status:'AWAITING'}}
            ) 
        }


        await prescribes.updateOne(
            {_id: id},
            {$set: {status: 'closed', tag:'nurse', flag: 'Approved'}}
        ) 

        const getpatientName = await  Patient.findOne({_id:uid})
        const io = getIO()
        io.to("pharmacy").emit("message", `Patient ${getpatientName?.name} Drug Request Sent !!`)

        const notify =  await notifications.findOne({uid})

        if(notify){
            await notifications.updateOne(
                {uid: uid},
                {$set: {
                    role: 'pharmacy',
                    type: 'New Requests',
                    message: `Doctor Request for`,
                    timeStamp : new Date().getTime(),
                    tag: 'PAID'
                }}
            )
        }else{
            await notifications.create({
                uid: uid,
                role: 'pharmacy',
                type: 'New Requests',
                message: `Doctor Request for`,
                timeStamp : new Date().getTime(),
                tag: 'PAID'
            })
        }

        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;