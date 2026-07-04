// editdrug
const express = require('express');
const router = express.Router();
const { serve } = require('../../model');

router.post('/', async (req, res) => {

  const {name, price, id, type} = req.body

  try {
    await serve.updateOne(
      {_id: id},
      {
          name,
          price,
          type 
      }
    )
    

    res.json({ status: 'success'});
  } catch (error) {
    console.error(error);
    res.json({ status: 'error', message: error.message });
  }
});

module.exports = router;
