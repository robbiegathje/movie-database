const axios = require('axios');
const { apiRequestHeaders, baseApiUrl, searchPath } = require('../config');

const MOVIE_PATH = '/movie';

class Movie {
	static async get(id) {
		const res = await axios.get(baseApiUrl + MOVIE_PATH + `/${id}`, {
			headers: apiRequestHeaders,
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
