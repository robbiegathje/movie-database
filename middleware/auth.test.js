const { createToken } = require('../helpers/tokens');
const {
	authenticateJWT,
	verifyCorrectUser,
	verifyLoggedIn,
} = require('./auth');
const { ForbiddenError, UnauthorizedError } = require('../expressError');

const MOCK_USER = { id: 44, username: 'Elly', password: 'bigredmachine' };
const TOKEN = createToken(MOCK_USER);
const MOCK_BAD_TOKEN =
	'eyJhbGciOiJUzI1NiIEUCREWBCcijow43kpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUi6MTY4OTI5OTYzNX0.CwAhyIDUIEFN3478ep8hZQXrFOIUEHR0_q9JcDobq6yrAPo';

describe('authenticateJWT', () => {
	it('sets res.locals.user whenever the authorization header contains a valid token', () => {
		expect.assertions(2);
		const req = { headers: { authorization: `Bearer ${TOKEN}` } };
		let res = { locals: {} };
		const next = (error) => {
			expect(error).toBeFalsy();
		};
		authenticateJWT(req, res, next);
		expect(res).toEqual({
			locals: {
				user: {
					id: MOCK_USER.id,
					username: MOCK_USER.username,
					iat: expect.any(Number),
				},
			},
		});
	});

	it('calls next, does not set res.locals.user, whenever the authorization header is empty', () => {
		expect.assertions(2);
		const req = {};
		let res = { locals: {} };
		const next = (error) => {
			expect(error).toBeFalsy();
		};
		authenticateJWT(req, res, next);
		expect(res).toEqual({
			locals: {},
		});
	});

	it('calls next, does not set res.locals.user, whenever the authorization header contains an invalid token', () => {
		expect.assertions(2);
		const req = { headers: { authorization: `Bearer ${MOCK_BAD_TOKEN}` } };
		let res = { locals: {} };
		const next = (error) => {
			expect(error).toBeFalsy();
		};
		authenticateJWT(req, res, next);
		expect(res).toEqual({
			locals: {},
		});
	});
});

describe('verifyLoggedIn', () => {
	it('calls next without an error whenever user is logged in', () => {
		expect.assertions(2);
		const req = { headers: { authorization: `Bearer ${TOKEN}` } };
		let res = { locals: {} };
		const next = (error) => {
			expect(error).toBeFalsy();
		};
		authenticateJWT(req, res, next);
		verifyLoggedIn(req, res, next);
	});

	it('calls next with an error whenever user is not logged in', () => {
		expect.assertions(2);
		const req = {};
		let res = { locals: {} };
		const nextNoError = (error) => {
			expect(error).toBeFalsy();
		};
		const nextWithError = (error) => {
			expect(error).toBeInstanceOf(UnauthorizedError);
		};
		authenticateJWT(req, res, nextNoError);
		verifyLoggedIn(req, res, nextWithError);
	});
});

describe('verifyCorrectUser', () => {
	it('calls next without an error whenever correct user is logged in', () => {
		expect.assertions(2);
		const req = {
			headers: { authorization: `Bearer ${TOKEN}` },
			params: { id: MOCK_USER.id },
		};
		let res = { locals: {} };
		const next = (error) => {
			expect(error).toBeFalsy();
		};
		authenticateJWT(req, res, next);
		verifyCorrectUser(req, res, next);
	});

	it('calls next with an error whenever user is not logged in', () => {
		expect.assertions(2);
		const req = { params: { id: MOCK_USER.id } };
		let res = { locals: {} };
		const nextNoError = (error) => {
			expect(error).toBeFalsy();
		};
		const nextWithError = (error) => {
			expect(error).toBeInstanceOf(UnauthorizedError);
		};
		authenticateJWT(req, res, nextNoError);
		verifyCorrectUser(req, res, nextWithError);
	});

	it('calls next with an error whenever incorrect user is logged in', () => {
		expect.assertions(2);
		const req = {
			headers: { authorization: `Bearer ${TOKEN}` },
			params: { id: 0 },
		};
		let res = { locals: {} };
		const nextNoError = (error) => {
			expect(error).toBeFalsy();
		};
		const nextWithError = (error) => {
			expect(error).toBeInstanceOf(ForbiddenError);
		};
		authenticateJWT(req, res, nextNoError);
		verifyCorrectUser(req, res, nextWithError);
	});
});
