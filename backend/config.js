// const { apiToken, secretKey } = require('./secret');

require('dotenv').config();

const apiToken = process.env.apiToken;
const secretKey = process.env.secretKey;

const config = {
	apiBaseUrl: 'https://api.themoviedb.org/3',
	apiImageUrl: 'https://image.tmdb.org/t/p/',
	posterSize: 'w780',
	searchPath: '/search',
	apiRequestHeaders: { Authorization: `Bearer ${apiToken}` },
	imdbBaseUrl: 'https://www.imdb.com/title/',
	secretKey: secretKey,
	bcryptWorkFactor: 14,
};

module.exports = config;
