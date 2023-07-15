const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');
const { UnauthorizedError, ForbiddenError } = require('../expressError');

function authenticateJWT(req, res, next) {
	try {
		const authHeader = req.headers && req.headers.authorization;
		if (authHeader) {
			const token = authHeader.replace(/^[Bb]earer /, '').trim();
			res.locals.user = jwt.verify(token, secretKey);
		}
		return next();
	} catch (error) {
		return next();
	}
}

function verifyLoggedIn(req, res, next) {
	try {
		if (!res.locals.user) {
			throw new UnauthorizedError();
		}
		return next();
	} catch (error) {
		return next(error);
	}
}

function verifyCorrectUser(req, res, next) {
	try {
		if (!res.locals.user) {
			throw new UnauthorizedError();
		} else if (+res.locals.user.id !== +req.params.id) {
			throw new ForbiddenError();
		}
		return next();
	} catch (error) {
		return next(error);
	}
}

module.exports = { authenticateJWT, verifyLoggedIn, verifyCorrectUser };
