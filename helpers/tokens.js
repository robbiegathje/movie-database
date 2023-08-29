const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');

function createToken(user) {
	const payload = { id: user.id, username: user.username };
	return jwt.sign(payload, secretKey);
}

module.exports = { createToken };
