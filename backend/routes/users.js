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

router.get('/:id/favorited-movies', verifyCorrectUser, async (req, res) => {
	const user = res.locals.user;
	const favorites = await User.getFavorites(user.id);
	return res.json({ favorites });
});

router.post('/:id/favorited-movies', verifyCorrectUser, async (req, res) => {
	const { id } = req.body;
	const user = res.locals.user;
	await User.addFavorite(user.id, id);
	return res.json('favorited');
});

module.exports = router;
