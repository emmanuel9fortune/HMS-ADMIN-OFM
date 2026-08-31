const express = require('express');
const router = express.Router();
const { rosters } = require('../../model');

router.post('/', async (req, res) => {
  try {
    const roster = await rosters.findOne({type:'nurse'})

    res.json({ status: 'success', roster });
  } catch (error) {
    console.error(error);
    res.json({ status: 'error', message: error.message });
  }
});

module.exports = router;
