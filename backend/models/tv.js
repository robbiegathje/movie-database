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
	static async get(id) {
		const res = await axios.get(apiBaseUrl + TV_PATH + `/${id}`, {
			headers: apiRequestHeaders,
			params: APPEND_TO_RESPONSE,
		});
		let series = {};
		if (res && res.data) {
			series.api_id = res.data.id;
			series.imdb_url = imdbBaseUrl + res.data.external_ids.imdb_id;
			series.name = res.data.name;
			series.tagline = res.data.tagline;
			series.genres = res.data.genres;
			series.overview = res.data.overview;
			series.poster_url = apiImageUrl + posterSize + res.data.poster_path;
			series.first_air_date = res.data.first_air_date;
			series.seasons = res.data.number_of_seasons;
			series.episodes = res.data.number_of_episodes;
			series.status = res.data.status;
			series.videos = res.data.videos.results;
			series.streaming = res.data['watch/providers'].results.US.flatrate;
			series.credits = res.data.credits;
		}
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
