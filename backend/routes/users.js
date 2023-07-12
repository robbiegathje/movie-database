const express = require('express');
const User = require('../models/user');
const { verifyCorrectUser } = require('../middleware/auth');
const router = new express.Router();

router.patch('/:id/change-password', verifyCorrectUser, async (req, res) => {
	const { password, newPassword } = req.body;
	const user = res.locals.user;
	await User.changePassword(user.username, password, newPassword);
	return res.json('password changed');
});

router.patch('/:id/change-username', verifyCorrectUser, async (req, res) => {
	const { password, newUsername } = req.body;
	const user = res.locals.user;
	const updatedUser = await User.changeUsername(
		user.username,
		password,
		newUsername
	);
	const token = createToken(updatedUser);
	return res.json({ token });
});

module.exports = router;
