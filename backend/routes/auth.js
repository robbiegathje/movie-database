const express = require('express');
const User = require('../models/user');
const { createToken } = require('../helpers/tokens');
const router = new express.Router();

router.post('/register', async (req, res) => {
	const { username, password } = req.body;
	const user = await User.register(username, password);
	const token = createToken(user);
	return res.json({ token });
});

router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	const user = await User.authenticate(username, password);
	const token = createToken(user);
	return res.json({ token });
});

module.exports = router;
