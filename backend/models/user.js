const db = require('../db');
const bcrypt = require('bcrypt');
const { bcryptWorkFactor } = require('../config');

class User {
	static async getById(id) {
		const results = await db.query(
			`SELECT id, username, password
			FROM users
			WHERE id=$1`,
			[id]
		);
		return results.rows[0];
	}

	static async getByUsername(username) {
		const results = await db.query(
			`SELECT id, username, password
			FROM users
			WHERE username=$1`,
			[username]
		);
		return results.rows[0];
	}

	static async authenticate(username, password) {
		const user = await User.getByUsername(username);
		if (await bcrypt.compare(password, user.password)) {
			return user;
		} else {
			return false;
		}
	}

	static async register(username, password) {
		const hashedPassword = await bcrypt.hash(password, bcryptWorkFactor);
		const results = await db.query(
			`INSERT INTO users (username, password)
			VALUES ($1, $2)
			RETURNING id, username, password`,
			[username, hashedPassword]
		);
		return results.rows[0];
	}

	static async changePassword(username, password, newPassword) {
		if (!User.authenticate(username, password)) {
			throw new Error('WRONG');
		}
		const hashedPassword = await bcrypt.hash(newPassword, bcryptWorkFactor);
		const results = await db.query(
			`UPDATE users
			SET password=$1
			WHERE username=$2
			RETURNING id, username, password`,
			[hashedPassword, username]
		);
		return results.rows[0];
	}

	static async changeUsername(username, password, newUsername) {
		if (!User.authenticate(username, password)) {
			throw new Error('WRONG');
		}
		const results = await db.query(
			`UPDATE users
			SET username=$1
			WHERE username=$2
			RETURNING id, username, password`,
			[newUsername, username]
		);
		return results.rows[0];
	}
}

module.exports = User;
