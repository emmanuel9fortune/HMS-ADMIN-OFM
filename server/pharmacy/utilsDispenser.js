const express = require('express');
const router = express.Router();
const { billRequests, Patient, notifications, util, Dispensing} = require('../../model');
const { getIO } = require('../../socketManager');

router.post('/', async(req, res) => {

    const uid = req.body.uid
    const billId = req.body.billId
    const staffId = req.body.staffId
    const tag = req.body.tag

    try {
        if(tag === 'PAID'){
            await billRequests.updateOne({uid, _id:billId },{status:'PAID'})

            const bill = await billRequests.findOne({
                uid,
                _id: billId
            });

            if (!bill) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Bill not found'
                });
            }

            // services is stored as a JSON string
            const services = JSON.parse(bill.services);

            // The drugs/products in the bill
            const cartItems = services.items;
            const dispensedItems = [];

            for (let item of cartItems) {

                const drug = await util.findOneAndUpdate(
                    {
                        _id: item.id,
                        quantity: { $gte: item.quantity }
                    },
                    {
                        $inc: {
                            quantity: -item.quantity
                        }
                    },
                    {
                        new: true
                    }
                );

                if (!drug) {
                    return res.status(400).json({
                        status: "error",
                        message: `Insufficient stock for ${item.name}`
                    });
                }

                dispensedItems.push({
                    utilId: drug._id,
                    name: drug.name,
                    quantity: item.quantity,
                    sellingPrice: drug.sellingPrice,
                    originalPrice: drug.originalPrice
                });
            }

            const totalQuantity = dispensedItems.reduce(
                (total, item) => total + item.quantity,
                0
            );

            await Dispensing.create({
                billId: bill._id,
                patientId: bill.uid,
                staffId,
                items: dispensedItems,
                totalQuantity
            });
        }else{
            await billRequests.updateOne({uid, _id:billId },{status:'PENDING', tagged:'PAID'})

            const bill = await billRequests.findOne({
                uid,
                _id: billId
            });

            if (!bill) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Bill not found'
                });
            }

            // services is stored as a JSON string
            const services = JSON.parse(bill.services);

            // The drugs/products in the bill
            const cartItems = services.items;
            const dispensedItems = [];

            for (let item of cartItems) {

                const drug = await util.findOneAndUpdate(
                    {
                        _id: item.id,
                        quantity: { $gte: item.quantity }
                    },
                    {
                        $inc: {
                            quantity: -item.quantity
                        }
                    },
                    {
                        new: true
                    }
                );

                if (!drug) {
                    return res.status(400).json({
                        status: "error",
                        message: `Insufficient stock for ${item.name}`
                    });
                }

                dispensedItems.push({
                    utilId: drug._id,
                    name: drug.name,
                    quantity: item.quantity,
                    sellingPrice: drug.sellingPrice,
                    originalPrice: drug.originalPrice
                });
            }

            const totalQuantity = dispensedItems.reduce(
                (total, item) => total + item.quantity,
                0
            );

            await Dispensing.create({
                billId: bill._id,
                patientId: bill.uid,
                staffId,
                items: dispensedItems,
                totalQuantity
            });
        }
        
        const getpatientName = await  Patient.findOne({_id:uid})
        const io = getIO()
        io.to("cashier").emit("message", `Patient ${getpatientName?.name} Bill Sent !!`)
        io.to("receptionist").emit("message", `Patient ${getpatientName?.name} Bill Sent !!`)

        await notifications.deleteOne({uid: uid})

        if(getpatientName?.status !== 'admitted'){
            await Patient.updateOne(
                {_id:uid},
                {$set: {status: 'cashier'}} 
            )
        }else{
            await Patient.updateOne(
                {_id:uid},
                {$set: {status: getpatientName?.status}}
            )
        }
        
        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;