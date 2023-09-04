const axios = require('axios');

const db = require('../db');
const Movie = require('./movie');
const Genre = require('./genre');
const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	MOCK_MOVIES,
} = require('./_testCommon');

jest.mock('axios');

const MOCK_MOVIE_FROM_API = {
	id: 2,
	imdb_id: 'm3',
	title: 'Batman 2',
	tagline: 'The Dark Knight Returns',
	genres: [{ id: 44, name: 'crime' }],
	overview: 'He returns in the night.',
	poster_path: 'batman2poster.jpeg',
	release_date: '2024-09-03',
	runtime: 183,
};

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('getLocal', () => {
	it('retrieve the locally saved movie with the specified api_id from the db', async () => {
		const batman = await Movie.getLocal(MOCK_MOVIES.batman.api_id);
		expect(batman).toEqual({
			...MOCK_MOVIES.batman,
			release_date: expect.any(Date),
		});
	});
});

describe('getMovieGenres', () => {
	it('retrieves the locally saved genres for the movie with the specified api_id', async () => {
		const action = await Genre.getLocal(123);
		const genres = await Movie.getMovieGenres(MOCK_MOVIES.batman.api_id);
		expect(genres).toEqual([{ name: action.name }]);
	});
});

describe('saveMovieGenres', () => {
	it('saves the provided genres to the local db and creates a relationship between those genres and the movie with the specified api_id', async () => {
		await Movie.saveMovieGenres(MOCK_MOVIES.batman.api_id, [
			{ id: 44, name: 'crime' },
			{ id: 123, name: 'action' },
		]);
		const crime = await Genre.getLocal(44);
		const action = await Genre.getLocal(123);
		const results = await db.query(
			`SELECT movie_id, genre_id FROM movie_genres WHERE movie_id=$1`,
			[MOCK_MOVIES.batman.id]
		);
		expect(results.rows).toEqual([
			{ movie_id: MOCK_MOVIES.batman.id, genre_id: action.id },
			{ movie_id: MOCK_MOVIES.batman.id, genre_id: crime.id },
		]);
	});
});

describe('save', () => {
	it('saves the movie with the specified api_id to the local db', async () => {
		axios.get.mockResolvedValue({ data: { ...MOCK_MOVIE_FROM_API } });
		const batmanTwo = await Movie.save(MOCK_MOVIE_FROM_API.id);
		let expectedReturn = { ...MOCK_MOVIE_FROM_API };
		delete expectedReturn.id;
		delete expectedReturn.genres;
		delete expectedReturn.release_date;
		expectedReturn.api_id = MOCK_MOVIE_FROM_API.id;
		expect(batmanTwo).toEqual({
			...expectedReturn,
			id: expect.any(Number),
			release_date: expect.any(Date),
		});
		expect(await Movie.getLocal(MOCK_MOVIE_FROM_API.id)).toEqual({
			...expectedReturn,
			id: expect.any(Number),
			release_date: expect.any(Date),
		});
	});
});
