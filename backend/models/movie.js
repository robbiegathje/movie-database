const axios = require('axios');
const db = require('../db');
const Genre = require('./genre');
const getNestedProperty = require('../helpers/getNestedProperty');
const {
	apiBaseUrl,
	apiImageUrl,
	apiRequestHeaders,
	imdbBaseUrl,
	posterSize,
	searchPath,
} = require('../config');
const { NotFoundError } = require('../expressError');
const { MOVIE_NOT_FOUND } = require('../errorMessages');

const MOVIE_PATH = '/movie';
const APPEND_TO_RESPONSE = {
	append_to_response: 'videos,watch/providers,credits',
};

class Movie {
	static async getRawData(id) {
		try {
			const res = await axios.get(apiBaseUrl + MOVIE_PATH + `/${id}`, {
				headers: apiRequestHeaders,
				params: APPEND_TO_RESPONSE,
			});
			return res.data;
		} catch (error) {
			throw new NotFoundError(MOVIE_NOT_FOUND);
		}
	}

	static filterData(raw) {
		const movie = {
			api_id: raw.api_id ? raw.api_id : raw.id,
			imdb_url: raw.imdb_id ? imdbBaseUrl + raw.imdb_id : undefined,
			title: raw.title,
			tagline: raw.tagline,
			genres: raw.genres,
			overview: raw.overview,
			poster_url: raw.poster_path
				? apiImageUrl + posterSize + raw.poster_path
				: undefined,
			release_date: raw.release_date,
			runtime: raw.runtime,
			videos: getNestedProperty(raw, 'videos.results'),
			streaming: getNestedProperty(raw, 'watch/providers.results.US.flatrate'),
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
		return res.data.results.map((movie) => {
			return Movie.filterData(movie);
		});
	}

	static async save(id) {
		const movie = await Movie.getRawData(id);
		const query = (await Movie.getLocal(id))
			? `UPDATE movies
			SET api_id=$1, imdb_id=$2, title=$3, tagline=$4, overview=$5,
			poster_path=$6, release_date=$7, runtime=$8
			WHERE api_id=$1
			RETURNING id, api_id, imdb_id, title, tagline, overview, poster_path, release_date, runtime`
			: `INSERT INTO movies
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
		await Movie.saveMovieGenres(movie.id, movie.genres);
		return results.rows[0];
	}

	static async saveMovieGenres(id, genres) {
		const movie = await Movie.getLocal(id);
		for (let genre of genres) {
			const savedGenre = await Genre.save(genre.id, genre.name);
			const results = await db.query(
				`SELECT id FROM movie_genres WHERE genre_id=$1 AND movie_id=$2`,
				[savedGenre.id, movie.id]
			);
			const existingMovieGenre = results.rows[0];
			if (!existingMovieGenre) {
				await db.query(
					`INSERT INTO movie_genres (genre_id, movie_id)
				VALUES ($1, $2)`,
					[savedGenre.id, movie.id]
				);
			}
		}
	}

	static async getLocal(id) {
		const results = await db.query(
			`SELECT id, api_id, imdb_id, title, tagline, overview, poster_path, release_date, runtime
			FROM movies
			WHERE api_id=$1`,
			[id]
		);
		return results.rows[0];
	}

	static async getMovieGenres(id) {
		const movie = await Movie.getLocal(id);
		const results = await db.query(
			`SELECT name
			FROM genres
			JOIN movie_genres ON genres.id = movie_genres.genre_id
			WHERE movie_id=$1`,
			[movie.id]
		);
		return results.rows;
	}
}

module.exports = Movie;
