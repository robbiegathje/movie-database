const axios = require('axios');
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
			api_id: raw.id,
			imdb_url: imdbBaseUrl + raw.external_ids.imdb_id,
			name: raw.name,
			tagline: raw.tagline,
			genres: raw.genres,
			overview: raw.overview,
			poster_url: apiImageUrl + posterSize + raw.poster_path,
			first_air_date: raw.first_air_date,
			seasons: raw.number_of_seasons,
			episodes: raw.number_of_episodes,
			status: raw.status,
			videos: raw.videos.results,
			streaming: raw['watch/providers'].results.US.flatrate,
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
		return res.data.results;
	}
}

module.exports = Tv;
