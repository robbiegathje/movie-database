const axios = require('axios');
const { apiRequestHeaders, baseApiUrl, searchPath } = require('../config');

const TV_PATH = '/tv';
const APPEND_TO_RESPONSE = {
	append_to_response: 'external_ids,videos,watch/providers,credits',
};

class Tv {
	static async get(id) {
		const res = await axios.get(baseApiUrl + TV_PATH + `/${id}`, {
			headers: apiRequestHeaders,
			params: APPEND_TO_RESPONSE,
		});
		return res.data;
	}
	static async search(query) {
		const res = await axios.get(baseApiUrl + searchPath + TV_PATH, {
			headers: apiRequestHeaders,
			params: { query },
		});
		return res.data.results;
	}
}

module.exports = Tv;
