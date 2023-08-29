const express = require('express');
const User = require('../models/user');
const { createToken } = require('../helpers/tokens');
const router = new express.Router();

router.post('/register', async (req, res, next) => {
	const { username, password } = req.body;
	try {
		const user = await User.register(username, password);
		const token = createToken(user);
		return res.json({ token });
	} catch (error) {
		return next(error);
	}
});

router.post('/login', async (req, res, next) => {
	const { username, password } = req.body;
	try {
		const user = await User.authenticate(username, password);
		const token = createToken(user);
		return res.json({ token });
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
