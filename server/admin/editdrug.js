// editdrug
const express = require('express');
const router = express.Router();
const { util } = require('../../model');

router.post('/', async (req, res) => {

  const {name, oprice, sprice, id, originalQuantity, quantity, expireDate, batch, limit, explimit} = req.body

  const originalPrice = Number(oprice)
  const sellingPrice = Number(sprice)

  try {
    await util.updateOne(
      {_id: id},
      {
          name,
          originalPrice,
          sellingPrice,
          originalQuantity, 
          quantity, 
          expireDate, 
          batch, 
          limit, 
          explimit
      }
    )
    

    res.json({ status: 'success'});
  } catch (error) {
    console.error(error);
    res.json({ status: 'error', message: error.message });
  }
});

module.exports = router;
