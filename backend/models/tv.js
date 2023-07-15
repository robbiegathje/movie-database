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

const TV_PATH = '/tv';
const APPEND_TO_RESPONSE = {
	append_to_response: 'external_ids,videos,watch/providers,credits',
};

class Tv {
	static async getRawData(id) {
		const res = await axios.get(apiBaseUrl + TV_PATH + `/${id}`, {
			headers: apiRequestHeaders,
			params: APPEND_TO_RESPONSE,
		});
		return res.data;
	}

	static filterData(raw) {
		const series = {
			api_id: raw.api_id ? raw.api_id : raw.id,
			imdb_url: getNestedProperty(raw, 'external_ids.imdb_id')
				? imdbBaseUrl + raw.external_ids.imdb_id
				: undefined,
			name: raw.name,
			tagline: raw.tagline,
			genres: raw.genres,
			overview: raw.overview,
			poster_url: raw.poster_path
				? apiImageUrl + posterSize + raw.poster_path
				: undefined,
			first_air_date: raw.first_air_date,
			seasons: raw.number_of_seasons,
			episodes: raw.number_of_episodes,
			status: raw.status,
			videos: getNestedProperty(raw, 'videos.results'),
			streaming: getNestedProperty(raw, 'watch/providers.results.US.flatrate'),
			credits: raw.credits,
		};
		return series;
	}

	static async get(id) {
		const raw = await Tv.getRawData(id);
		const series = Tv.filterData(raw);
		return series;
	}

	static async search(query) {
		const res = await axios.get(apiBaseUrl + searchPath + TV_PATH, {
			headers: apiRequestHeaders,
			params: { query },
		});
		return res.data.results.map((series) => {
			return Tv.filterData(series);
		});
	}

	static async save(id) {
		const series = await Tv.getRawData(id);
		const query = (await Tv.getLocal(id))
			? `UPDATE tv
			SET api_id=$1, imdb_id=$2, name=$3, tagline=$4, overview=$5,
			poster_path=$6, first_air_date=$7, seasons=$8, episodes=$9, status=$10
			WHERE api_id=$1
			RETURNING id, api_id, imdb_id, name, tagline, overview, poster_path, first_air_date, seasons, episodes, status`
			: `INSERT INTO tv
		(api_id, imdb_id, name, tagline, overview, poster_path, first_air_date, seasons, episodes, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id, api_id, imdb_id, name, tagline, overview, poster_path, first_air_date, seasons, episodes, status`;
		const results = await db.query(query, [
			series.id,
			series.external_ids.imdb_id,
			series.name,
			series.tagline,
			series.overview,
			series.poster_path,
			series.first_air_date,
			series.number_of_seasons,
			series.number_of_episodes,
			series.status,
		]);
		await Tv.saveTvGenres(series.id, series.genres);
		return results.rows[0];
	}

	static async saveTvGenres(id, genres) {
		const series = await Tv.getLocal(id);
		for (let genre of genres) {
			const savedGenre = await Genre.save(genre.id, genre.name);
			const results = await db.query(
				`SELECT id FROM tv_genres WHERE genre_id=$1 AND tv_id=$2`,
				[savedGenre.id, series.id]
			);
			const existingTvGenre = results.rows[0];
			if (!existingTvGenre) {
				await db.query(
					`INSERT INTO tv_genres (genre_id, tv_id)
				VALUES ($1, $2)`,
					[savedGenre.id, series.id]
				);
			}
		}
	}

	static async getLocal(id) {
		const results = await db.query(
			`SELECT id, api_id, imdb_id, name, tagline, overview, poster_path, first_air_date, seasons, episodes, status
			FROM tv
			WHERE api_id=$1`,
			[id]
		);
		return results.rows[0];
	}

	static async getTvGenres(id) {
		const series = await Tv.getLocal(id);
		const results = await db.query(
			`SELECT name
			FROM genres
			JOIN tv_genres ON genres.id = tv_genres.genre_id
			WHERE tv_id=$1`,
			[series.id]
		);
		return results.rows;
	}
}

module.exports = Tv;
