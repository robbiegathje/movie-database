const axios = require('axios');
const { apiRequestHeaders, baseApiUrl, searchPath } = require('../config');

const MOVIE_PATH = '/movie';
const APPEND_TO_RESPONSE = {
	append_to_response: 'videos,watch/providers,credits',
};

class Movie {
	static async get(id) {
		const res = await axios.get(baseApiUrl + MOVIE_PATH + `/${id}`, {
			headers: apiRequestHeaders,
			params: APPEND_TO_RESPONSE,
		});
		return res.data;
	}
	static async search(query) {
		const res = await axios.get(baseApiUrl + searchPath + MOVIE_PATH, {
			headers: apiRequestHeaders,
			params: { query },
		});
		return res.data.results;
	}
}

module.exports = Movie;
