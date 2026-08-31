// editdrug
const express = require('express');
const router = express.Router();
const { cards } = require('../../model');

router.post('/', async (req, res) => {

  const {morningCardAmount, eveningCardAmount, familyCardAmount} = req.body

  try {
    await cards.updateOne(
      {id: "admin"},
      {
        morningCardAmount,
        eveningCardAmount,
        familyCardAmount
      }
    )

    res.json({ status: 'success'});
  } catch (error) {
    console.error(error);
    res.json({ status: 'error', message: error.message });
  }
});

module.exports = router;
