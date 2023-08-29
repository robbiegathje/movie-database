const bcrypt = require('bcrypt');
const db = require('../db');
const { bcryptWorkFactor } = require('../config');

const MOCK_USERS = {
	rob: { username: 'rob', password: 'testing' },
	carly: { username: 'carly', password: 'testing' },
};

async function commonBeforeAll() {
	await db.query('DELETE FROM favorited_movies');
	await db.query('DELETE FROM favorited_tv');
	await db.query('DELETE FROM users');
	await db.query('DELETE FROM movie_genres');
	await db.query('DELETE FROM tv_genres');
	await db.query('DELETE FROM genres');
	await db.query('DELETE FROM movies');
	await db.query('DELETE FROM tv');
	const results = await db.query(
		`INSERT INTO users (username, password)
		VALUES ($1, $2),
		($3, $4)
		RETURNING id`,
		[
			MOCK_USERS.rob.username,
			await bcrypt.hash(MOCK_USERS.rob.password, bcryptWorkFactor),
			MOCK_USERS.carly.username,
			await bcrypt.hash(MOCK_USERS.carly.password, bcryptWorkFactor),
		]
	);
	MOCK_USERS.rob.id = results.rows[0];
	MOCK_USERS.carly.id = results.rows[1];
}

async function commonBeforeEach() {
	await db.query('BEGIN');
}

async function commonAfterEach() {
	await db.query('ROLLBACK');
}

async function commonAfterAll() {
	await db.end();
}

module.exports = {
	MOCK_USERS,
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
};
