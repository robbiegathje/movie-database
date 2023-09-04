const axios = require('axios');

const db = require('../db');
const Tv = require('./tv');
const Genre = require('./genre');
const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	MOCK_SERIES,
} = require('./_testCommon');

jest.mock('axios');

const MOCK_SERIES_FROM_API = {
	id: 2,
	external_ids: { imdb_id: 't3' },
	name: 'Game of Thrones',
	tagline: 'Winter is Coming',
	genres: [{ id: 55, name: 'fantasy' }],
	overview: 'a lot happens',
	poster_path: 'gameofthronesposter.jpeg',
	first_air_date: '2023-09-03',
	number_of_seasons: 8,
	number_of_episodes: 80,
	status: 'Ended',
};

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('getLocal', () => {
	it('retrieve the locally saved tv series with the specified api_id from the db', async () => {
		const lasso = await Tv.getLocal(MOCK_SERIES.lasso.api_id);
		expect(lasso).toEqual({
			...MOCK_SERIES.lasso,
			first_air_date: expect.any(Date),
		});
	});
});

describe('getTvGenres', () => {
	it('retrieves the locally saved genres for the tv series with the specified api_id', async () => {
		const drama = await Genre.getLocal(456);
		const genres = await Tv.getTvGenres(MOCK_SERIES.lasso.api_id);
		expect(genres).toEqual([{ name: drama.name }]);
	});
});

describe('saveTvGenres', () => {
	it('saves the provided genres to the local db and creates a relationship between those genres and the tv series with the specified api_id', async () => {
		await Tv.saveTvGenres(MOCK_SERIES.lasso.api_id, [
			{ id: 77, name: 'comedy' },
			{ id: 456, name: 'drama' },
		]);
		const comedy = await Genre.getLocal(77);
		const drama = await Genre.getLocal(456);
		const results = await db.query(
			`SELECT tv_id, genre_id FROM tv_genres WHERE tv_id=$1`,
			[MOCK_SERIES.lasso.id]
		);
		expect(results.rows).toEqual([
			{ tv_id: MOCK_SERIES.lasso.id, genre_id: drama.id },
			{ tv_id: MOCK_SERIES.lasso.id, genre_id: comedy.id },
		]);
	});
});

describe('save', () => {
	it('saves the tv series with the specified api_id to the local db', async () => {
		axios.get.mockResolvedValue({ data: { ...MOCK_SERIES_FROM_API } });
		const gameOfThrones = await Tv.save(MOCK_SERIES_FROM_API.id);
		let expectedReturn = { ...MOCK_SERIES_FROM_API };
		delete expectedReturn.id;
		delete expectedReturn.external_ids;
		delete expectedReturn.genres;
		delete expectedReturn.first_air_date;
		delete expectedReturn.number_of_seasons;
		delete expectedReturn.number_of_episodes;
		expectedReturn.api_id = MOCK_SERIES_FROM_API.id;
		expectedReturn.imdb_id = MOCK_SERIES_FROM_API.external_ids.imdb_id;
		expectedReturn.seasons = MOCK_SERIES_FROM_API.number_of_seasons;
		expectedReturn.episodes = MOCK_SERIES_FROM_API.number_of_episodes;
		expect(gameOfThrones).toEqual({
			...expectedReturn,
			id: expect.any(Number),
			first_air_date: expect.any(Date),
		});
		expect(await Tv.getLocal(MOCK_SERIES_FROM_API.id)).toEqual({
			...expectedReturn,
			id: expect.any(Number),
			first_air_date: expect.any(Date),
		});
	});
});
