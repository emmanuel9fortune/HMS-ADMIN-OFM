// patientdiscount
const express = require('express');
const router = express.Router();
const { billRequests } = require('../../model');

router.post('/', async (req, res) => {

  const {amount, uid, name, staffID} = req.body

  try {
    await billRequests.create({
    uid,
    name,
    staffID,
    services: JSON.stringify({
        items:[{
            name: 'discount', 
            price: Number(amount), 
            quantity: 1, 
            totalPrice: Number(amount)
        }] , 
        totalPrice: Number(amount)
    }),
    status: 'PENDING',
    type: 'pharmacy',
    timeStamp : new Date().getTime()
})

    res.json({ status: 'success'});
  } catch (error) {
    console.error(error);
    res.json({ status: 'error', message: error.message });
  }
});

module.exports = router;
