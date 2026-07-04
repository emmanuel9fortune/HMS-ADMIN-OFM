const express = require('express');
const router = express.Router();
const { Patient, billRequests, notifications, request } = require('../../model');
const { getIO } = require('../../socketManager');

router.post('/', async (req, res) => {
    try {
        const { requests, type, uid, staffID, oid } = req.body;

        if (!requests || !type || !uid || !staffID) {
            return res.status(400).json({ status: 'error', message: 'Missing required fields' });
        }

        const _id = oid || uid

        const getPatientStatus = await Patient.findOne({_id: _id})
        

        if(getPatientStatus?.status !== 'emergency'){

            // Create request record
            let createdRequest = '';
            
            if(oid){
               createdRequest =  await request.create({
                    uid: oid,
                    staffID,
                    type,
                    requests: `${type} requested for`,
                    status: 'PENDING',
                    timeStamp: Date.now(),
                    oid
                });
            }else{
               createdRequest = await request.create({
                    uid,
                    staffID,
                    type,
                    requests: `${type} requested for`,
                    status: 'PENDING',
                    timeStamp: Date.now(),
                    oid
                });
            }

            // Create bill request
            await billRequests.create({
                services: Array.isArray(requests) ? JSON.stringify(requests) : String(requests),
                uid,
                staffID,
                status: 'PENDING',
                approve: createdRequest?._id, 
                type: type === 'test' ? 'lab' : type,
                timeStamp: Date.now(),
                oid
            });

            // Fetch patient once (avoid duplicate DB hits)
            const patient = await Patient.findById(uid).lean();
            if (!patient) {
                return res.status(404).json({ status: 'error', message: 'Patient not found' });
            }

            // Notify receptionists
            const io = getIO();
            io.to("cashier").emit("message", `Patient ${patient.name} Bill Sent !!`);
            io.to("receptionist").emit("message", `Patient ${patient.name} Bill Sent !!`);

            // Handle notifications (upsert)
            await notifications.deleteOne(
                { uid }
            );

            // Update patient status
            await Patient.updateOne(
                { _id: uid },
                { $set: { status: patient.status !== 'admitted' ? 'cashier' : patient.status } }
            );

            res.json({ status: 'success', getPatientStatus });
        }else{
            
            // Create request record
            let createdRequest = '';
            
            if(oid){
                createdRequest = await request.create({
                    uid: oid,
                    staffID,  
                    type,
                    requests: `${type} requested for`,
                    status: 'AWAITING',
                    timeStamp: Date.now(),
                    oid
                });
            }else{
                createdRequest = await request.create({
                    uid,
                    staffID,
                    type,
                    requests: `${type} requested for`,
                    status: 'AWAITING',
                    timeStamp: Date.now(),
                    oid
                });
            }

            // Create bill request
            await billRequests.create({
                services: Array.isArray(requests) ? JSON.stringify(requests) : String(requests),
                uid,
                staffID,
                status: 'PENDING',
                approve: createdRequest?._id, 
                type: type === 'test' ? 'lab' : type,
                timeStamp: Date.now(),
                oid
            });

            // Fetch patient once (avoid duplicate DB hits)
            const patient = await Patient.findById(uid).lean();
            if (!patient) {
                return res.status(404).json({ status: 'error', message: 'Patient not found' });
            }

            // Notify receptionists
            const io = getIO();
            io.to("laboratory").emit("message", `Patient ${patient.name} Bill Sent !!`);

            // Handle notifications (upsert)
            await notifications.deleteOne(
                { uid }
            );

            res.json({ status: 'success' });
        }


    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
