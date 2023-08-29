const db = require('../db');
const bcrypt = require('bcrypt');
const Movie = require('./movie');
const Tv = require('./tv');
const { bcryptWorkFactor } = require('../config');
const { BadRequestError, UnauthorizedError } = require('../expressError');
const {
	DUPLICATE_USERNAME,
	FAILED_AUTHENTICATION,
} = require('../errorMessages');

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
			[username.toLowerCase()]
		);
		return results.rows[0];
	}

	static async authenticate(username, password) {
		const user = await User.getByUsername(username);
		if (user && (await bcrypt.compare(password, user.password))) {
			return user;
		} else {
			throw new UnauthorizedError(FAILED_AUTHENTICATION);
		}
	}

	static async register(username, password) {
		if (await User.getByUsername(username)) {
			throw new BadRequestError(DUPLICATE_USERNAME);
		}
		const hashedPassword = await bcrypt.hash(password, bcryptWorkFactor);
		const results = await db.query(
			`INSERT INTO users (username, password)
			VALUES ($1, $2)
			RETURNING id, username, password`,
			[username.toLowerCase(), hashedPassword]
		);
		return results.rows[0];
	}

	static async changePassword(username, password, newPassword) {
		try {
			await User.authenticate(username, password);
		} catch (error) {
			throw error;
		}
		const hashedPassword = await bcrypt.hash(newPassword, bcryptWorkFactor);
		const results = await db.query(
			`UPDATE users
			SET password=$1
			WHERE username=$2
			RETURNING id, username, password`,
			[hashedPassword, username.toLowerCase()]
		);
		return results.rows[0];
	}

	static async changeUsername(username, password, newUsername) {
		try {
			await User.authenticate(username, password);
		} catch (error) {
			throw error;
		}
		const results = await db.query(
			`UPDATE users
			SET username=$1
			WHERE username=$2
			RETURNING id, username, password`,
			[newUsername.toLowerCase(), username.toLowerCase()]
		);
		return results.rows[0];
	}

	static async getFavoriteMovies(id) {
		const results = await db.query(
			`SELECT movies.id, api_id, imdb_id, title, tagline, overview, poster_path, release_date, runtime
			FROM movies
			JOIN favorited_movies ON movies.id = favorited_movies.movie_id
			WHERE user_id=$1`,
			[id]
		);
		return results.rows.map((movie) => {
			return Movie.filterData(movie);
		});
	}

	static async addFavoriteMovie(userId, movieApiId) {
		const movie = await Movie.save(movieApiId);
		await db.query(
			`INSERT INTO favorited_movies (user_id, movie_id)
			VALUES ($1, $2)`,
			[userId, movie.id]
		);
	}

	static async removeFavoriteMovie(userId, movieApiId) {
		const movie = await Movie.getLocal(movieApiId);
		await db.query(
			`DELETE FROM favorited_movies
			WHERE user_id=$1 AND movie_id=$2`,
			[userId, movie.id]
		);
	}

	static async getFavoriteTv(id) {
		const results = await db.query(
			`SELECT tv.id, api_id, imdb_id, name, tagline, overview, poster_path, first_air_date, seasons, episodes, status
			FROM tv
			JOIN favorited_tv ON tv.id = favorited_tv.tv_id
			WHERE user_id=$1`,
			[id]
		);
		return results.rows.map((series) => {
			return Tv.filterData(series);
		});
	}

	static async addFavoriteTv(userId, tvApiId) {
		const series = await Tv.save(tvApiId);
		await db.query(
			`INSERT INTO favorited_tv (user_id, tv_id)
			VALUES ($1, $2)`,
			[userId, series.id]
		);
	}

	static async removeFavoriteTv(userId, tvApiId) {
		const series = await Tv.getLocal(tvApiId);
		await db.query(
			`DELETE FROM favorited_tv
			WHERE user_id=$1 AND tv_id=$2`,
			[userId, series.id]
		);
	}
}

module.exports = User;
