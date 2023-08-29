const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');
const { createToken } = require('./tokens');

const MOCK_USER = { id: 44, username: 'Elly', password: 'bigredmachine' };
const TOKEN = createToken(MOCK_USER);

describe('createToken', () => {
	it('returns a token with id and username', () => {
		expect(jwt.verify(TOKEN, secretKey)).toHaveProperty('id', MOCK_USER.id);
		expect(jwt.verify(TOKEN, secretKey)).toHaveProperty(
			'username',
			MOCK_USER.username
		);
		expect(jwt.verify(TOKEN, secretKey)).toHaveProperty('iat');
	});

	it('does not save password in the token payload', () => {
		expect(jwt.verify(TOKEN, secretKey)).not.toHaveProperty('password');
	});

	it('properly signs the token with the secretKey', () => {
		expect(() => {
			jwt.verify(TOKEN, 'not the secret key');
		}).toThrow('invalid signature');
	});
});
