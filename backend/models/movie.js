const axios = require('axios');
const db = require('../db');
const {
	apiBaseUrl,
	apiImageUrl,
	apiRequestHeaders,
	imdbBaseUrl,
	posterSize,
	searchPath,
} = require('../config');

const MOVIE_PATH = '/movie';
const APPEND_TO_RESPONSE = {
	append_to_response: 'videos,watch/providers,credits',
};

class Movie {
	static async getRawData(id) {
		const res = await axios.get(apiBaseUrl + MOVIE_PATH + `/${id}`, {
			headers: apiRequestHeaders,
			params: APPEND_TO_RESPONSE,
		});
		return res.data;
	}

	static filterData(raw) {
		const movie = {
			api_id: raw.id,
			imdb_url: imdbBaseUrl + raw.imdb_id,
			title: raw.title,
			tagline: raw.tagline,
			genres: raw.genres,
			overview: raw.overview,
			poster_url: apiImageUrl + posterSize + raw.poster_path,
			release_date: raw.release_date,
			runtime: raw.runtime,
			videos: raw.videos.results,
			streaming: raw['watch/providers'].results.US.flatrate,
			credits: raw.credits,
		};
		return movie;
	}

	static async get(id) {
		const raw = await Movie.getRawData(id);
		const movie = Movie.filterData(raw);
		return movie;
	}

	static async search(query) {
		const res = await axios.get(apiBaseUrl + searchPath + MOVIE_PATH, {
			headers: apiRequestHeaders,
			params: { query },
		});
		return res.data.results;
	}

	static async save(id) {
		const movie = await Movie.getRawData(id);
		const query = `INSERT INTO movies
		(api_id, imdb_id, title, tagline, overview, poster_path, release_date, runtime)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, api_id, imdb_id, title, tagline, overview, poster_path, release_date, runtime`;
		const results = await db.query(query, [
			movie.id,
			movie.imdb_id,
			movie.title,
			movie.tagline,
			movie.overview,
			movie.poster_path,
			movie.release_date,
			movie.runtime,
		]);
		return results.rows[0];
	}

	static async getLocal(id) {
		const results = await db.query(
			`SELECT id, api_id, imdb_id, title, tagline, overview, poster_path, release_date, runtime
			FROM movies
			WHERE id=$1`,
			[id]
		);
		return results.rows[0];
	}
}

module.exports = Movie;
