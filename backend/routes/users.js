const express = require('express');
const User = require('../models/user');
const { verifyCorrectUser } = require('../middleware/auth');
const { createToken } = require('../helpers/tokens');
const router = new express.Router();

router.patch(
	'/:id/change-password',
	verifyCorrectUser,
	async (req, res, next) => {
		const { password, newPassword } = req.body;
		const user = res.locals.user;
		try {
			await User.changePassword(user.username, password, newPassword);
			return res.json('password changed');
		} catch (error) {
			return next(error);
		}
	}
);

router.patch(
	'/:id/change-username',
	verifyCorrectUser,
	async (req, res, next) => {
		const { password, newUsername } = req.body;
		const user = res.locals.user;
		try {
			const updatedUser = await User.changeUsername(
				user.username,
				password,
				newUsername
			);
			const token = createToken(updatedUser);
			return res.json({ token });
		} catch (error) {
			return next(error);
		}
	}
);

router.get('/:id/favorite-movies', verifyCorrectUser, async (req, res) => {
	const user = res.locals.user;
	const favorites = await User.getFavoriteMovies(user.id);
	return res.json({ favorites });
});

router.post('/:id/favorite-movies', verifyCorrectUser, async (req, res) => {
	const { id } = req.body;
	const user = res.locals.user;
	await User.addFavoriteMovie(user.id, id);
	return res.json('favorited');
});

router.delete('/:id/favorite-movies', verifyCorrectUser, async (req, res) => {
	const { id } = req.body;
	const user = res.locals.user;
	await User.removeFavoriteMovie(user.id, id);
	return res.json('removed favorite');
});

router.get('/:id/favorite-tv', verifyCorrectUser, async (req, res) => {
	const user = res.locals.user;
	const favorites = await User.getFavoriteTv(user.id);
	return res.json({ favorites });
});

router.post('/:id/favorite-tv', verifyCorrectUser, async (req, res) => {
	const { id } = req.body;
	const user = res.locals.user;
	await User.addFavoriteTv(user.id, id);
	return res.json('favorited');
});

router.delete('/:id/favorite-tv', verifyCorrectUser, async (req, res) => {
	const { id } = req.body;
	const user = res.locals.user;
	await User.removeFavoriteTv(user.id, id);
	return res.json('removed favorite');
});

module.exports = router;
