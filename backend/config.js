const { apiToken } = require('./secret');

const config = {
	baseApiUrl: 'https://api.themoviedb.org/3',
	searchPath: '/search',
	apiRequestHeaders: { Authorization: `Bearer ${apiToken}` },
};

module.exports = config;
