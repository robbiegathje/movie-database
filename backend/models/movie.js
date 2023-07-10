const axios = require('axios');
const { baseApiUrl } = require('../config');
const { apiToken } = require('../secret');

const MOVIE_PATH = '/movie';

class Movie {
	static async get(id) {
		const res = await axios.get(`${baseApiUrl}${MOVIE_PATH}/${id}`, {
			headers: { Authorization: `Bearer ${apiToken}` },
		});
		return res.data;
	}
}

module.exports = Movie;
