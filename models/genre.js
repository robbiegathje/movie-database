const db = require('../db');

class Genre {
	static async getLocal(id) {
		const results = await db.query(
			`SELECT id, api_id, name
			FROM genres
			WHERE api_id=$1`,
			[id]
		);
		return results.rows[0];
	}

	static async save(id, name) {
		const existingGenre = await Genre.getLocal(id);
		if (existingGenre) {
			return existingGenre;
		}

		const results = await db.query(
			`INSERT INTO genres (api_id, name)
			VALUES ($1, $2)
			RETURNING id, api_id, name`,
			[id, name]
		);
		return results.rows[0];
	}
}

module.exports = Genre;
