const { apiToken } = require('./secret');

const config = {
	apiBaseUrl: 'https://api.themoviedb.org/3',
	apiImageUrl: 'https://image.tmdb.org/t/p/',
	posterSize: 'w780',
	searchPath: '/search',
	apiRequestHeaders: { Authorization: `Bearer ${apiToken}` },
	imdbBaseUrl: 'https://www.imdb.com/title/',
};

module.exports = config;
