const express = require('express');
const jsonschema = require('jsonschema');
const User = require('../models/user');
const userSchema = require('../schemas/userSchema.json');
const { BadRequestError } = require('../expressError');
const { INVALID_USERNAME } = require('../errorMessages');
const { createToken } = require('../helpers/tokens');
const router = new express.Router();

router.post('/register', async (req, res, next) => {
	const { username, password } = req.body;
	try {
		const validator = jsonschema.validate({ username, password }, userSchema);
		if (!validator.valid) {
			const errors = validator.errors.map((error) => {
				if (
					error.stack ===
					'instance.username does not match pattern "^[A-Za-z0-9_-]+$"'
				) {
					return INVALID_USERNAME;
				}
				return error.stack.replace('instance.', '');
			});
			throw new BadRequestError(errors);
		}
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
