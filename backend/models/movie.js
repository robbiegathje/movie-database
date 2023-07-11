const axios = require('axios');
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
	static async get(id) {
		const res = await axios.get(apiBaseUrl + MOVIE_PATH + `/${id}`, {
			headers: apiRequestHeaders,
			params: APPEND_TO_RESPONSE,
		});
		let movie = {};
		if (res && res.data) {
			movie.api_id = res.data.id;
			movie.imdb_url = imdbBaseUrl + res.data.imdb_id;
			movie.title = res.data.title;
			movie.tagline = res.data.tagline;
			movie.genres = res.data.genres;
			movie.overview = res.data.overview;
			movie.poster_url = apiImageUrl + posterSize + res.data.poster_path;
			movie.release_date = res.data.release_date;
			movie.runtime = res.data.runtime;
			movie.videos = res.data.videos.results;
			movie.streaming = res.data['watch/providers'].results.US.flatrate;
			movie.credits = res.data.credits;
		}
		return movie;
	}
	static async search(query) {
		const res = await axios.get(apiBaseUrl + searchPath + MOVIE_PATH, {
			headers: apiRequestHeaders,
			params: { query },
		});
		return res.data.results;
	}
}

module.exports = Movie;
