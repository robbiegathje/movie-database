const express = require('express');
const User = require('../models/user');
const router = new express.Router();

router.post('/register', async (req, res) => {
	const { username, password } = req.body;
	const user = await User.register(username, password);
	return res.json({ user });
});

router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	const user = await User.authenticate(username, password);
	return res.json({ user });
});

module.exports = router;
