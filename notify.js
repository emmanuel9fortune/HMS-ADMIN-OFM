const express = require('express');
const router = express.Router();
const { sendMessageToUser, isUserOnline } = require('../socket');

router.post('/', async (req, res) => {
  const { userId, message } = req.body;

  if (isUserOnline(userId)) {
    sendMessageToUser(userId, 'staff_notification', { message });
    res.json({ status: 'sent', online: true });
  } else {
    res.json({ status: 'not sent', online: false });
  }
});

module.exports = router;