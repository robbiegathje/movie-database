const express = require('express');
const jsonschema = require('jsonschema');
const User = require('../models/user');
const newPasswordSchema = require('../schemas/newPasswordSchema.json');
const newUsernameSchema = require('../schemas/newUsernameSchema.json');
const { BadRequestError } = require('../expressError');
const { INVALID_USERNAME } = require('../errorMessages');
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
			const validator = jsonschema.validate({ newPassword }, newPasswordSchema);
			if (!validator.valid) {
				const errors = validator.errors.map((error) => {
					return error.stack.replace('instance.newPassword', 'new password');
				});
				throw new BadRequestError(errors);
			}
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
			const validator = jsonschema.validate({ newUsername }, newUsernameSchema);
			if (!validator.valid) {
				const errors = validator.errors.map((error) => {
					if (
						error.stack ===
						'instance.username does not match pattern "^[A-Za-z0-9_-]+$"'
					) {
						return INVALID_USERNAME;
					}
					return error.stack.replace('instance.newUsername', 'new username');
				});
				throw new BadRequestError(errors);
			}
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
