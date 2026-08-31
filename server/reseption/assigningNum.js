const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    // handle login
    res.json({ message: 'Logged in' });
});

module.exports = router;