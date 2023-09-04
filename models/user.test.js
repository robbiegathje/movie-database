const axios = require('axios');
const bcrypt = require('bcrypt');

const User = require('./user');
const Movie = require('./movie');
const Tv = require('./tv');
const { BadRequestError, UnauthorizedError } = require('../expressError');
const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	MOCK_USERS,
	MOCK_MOVIES,
	MOCK_SERIES,
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

describe('getById', () => {
	it('retrieves the user with the specified id from the db', async () => {
		const robbie = await User.getById(MOCK_USERS.robbie.id);
		let expectedReturn = { ...MOCK_USERS.robbie };
		expectedReturn.password = expect.any(String);
		expect(robbie).toEqual(expectedReturn);
	});
});

describe('getByUsername', () => {
	it('retrieves the user with the specified username from the db', async () => {
		const robbie = await User.getByUsername(MOCK_USERS.robbie.username);
		let expectedReturn = { ...MOCK_USERS.robbie };
		expectedReturn.password = expect.any(String);
		expect(robbie).toEqual(expectedReturn);
	});
});

describe('authenticate', () => {
	it('verifies the specified username and password match a db entry', async () => {
		const carly = await User.authenticate(
			MOCK_USERS.carly.username,
			MOCK_USERS.carly.password
		);
		let expectedReturn = { ...MOCK_USERS.carly };
		expectedReturn.password = expect.any(String);
		expect(carly).toEqual(expectedReturn);
	});
	it('throws an UnauthorizedError if any user information in incorrect', async () => {
		try {
			await User.authenticate(MOCK_USERS.carly.username, 'WRONG');
			fail('authenticate should fail with incorrect password');
		} catch (error) {
			expect(error).toBeInstanceOf(UnauthorizedError);
		}
	});
});

describe('register', () => {
	it('creates a new user with the specified username and password, properly encrypted', async () => {
		const ollie = await User.register('ollie', 'testing123');
		let expectedReturn = {
			id: expect.any(Number),
			username: 'ollie',
			password: expect.any(String),
		};
		expect(ollie).toEqual(expectedReturn);
		expect(await bcrypt.compare('testing123', ollie.password)).toBeTruthy();
	});
	it('throws a BadRequestError if a user with the specified username already exists', async () => {
		try {
			await User.register(MOCK_USERS.carly.username, 'thiscouldbeanything');
			fail('register should fail with a duplicate username');
		} catch (error) {
			expect(error).toBeInstanceOf(BadRequestError);
		}
	});
	it('fails if a user with the specified username already exists, no matter the letter case', async () => {
		try {
			await User.register(
				MOCK_USERS.carly.username.toUpperCase(),
				'thiscouldbeanything'
			);
			fail('register should fail with a duplicate username of any letter case');
		} catch (error) {
			expect(error).toBeInstanceOf(BadRequestError);
		}
	});
});

describe('changePassword', () => {
	it('changes the password of the specified user', async () => {
		await User.changePassword(
			MOCK_USERS.carly.username,
			MOCK_USERS.carly.password,
			'newpassword'
		);
		try {
			await User.authenticate(
				MOCK_USERS.carly.username,
				MOCK_USERS.carly.password
			);
			fail(
				'authenticate with original password should fail after password change'
			);
		} catch (error) {
			expect(error).toBeInstanceOf(UnauthorizedError);
		}
		const carly = await User.authenticate(
			MOCK_USERS.carly.username,
			'newpassword'
		);
		let expectedReturn = { ...MOCK_USERS.carly };
		expectedReturn.password = expect.any(String);
		expect(carly).toEqual(expectedReturn);
	});
});

describe('changeUsername', () => {
	it('changes the username of the specified user', async () => {
		await User.changeUsername(
			MOCK_USERS.carly.username,
			MOCK_USERS.carly.password,
			'thecarlyg'
		);
		try {
			await User.authenticate(
				MOCK_USERS.carly.username,
				MOCK_USERS.carly.password
			);
			fail(
				'authenticate with original username should fail after username change'
			);
		} catch (error) {
			expect(error).toBeInstanceOf(UnauthorizedError);
		}
		const carly = await User.authenticate(
			'thecarlyg',
			MOCK_USERS.carly.password
		);
		expect(carly).toEqual({
			id: MOCK_USERS.carly.id,
			username: 'thecarlyg',
			password: expect.any(String),
		});
	});
});

describe('getFavoriteMovies', () => {
	it('retrieves all favorite movies belonging to the user with the specified id', async () => {
		const favorites = await User.getFavoriteMovies(MOCK_USERS.robbie.id);
		const expectedReturn = {
			...Movie.filterData(MOCK_MOVIES.batman),
			release_date: expect.any(Date),
		};
		expect(favorites).toEqual([expectedReturn]);
	});
});

describe('addFavoriteMovie', () => {
	it('saves favorited movie to database and to favorites for the specified user', async () => {
		axios.get.mockResolvedValue({ data: { ...MOCK_MOVIE_FROM_API } });
		await User.addFavoriteMovie(MOCK_USERS.robbie.id, MOCK_MOVIE_FROM_API.id);
		const favorites = await User.getFavoriteMovies(MOCK_USERS.robbie.id);
		const expectedReturn = [
			{
				...Movie.filterData(MOCK_MOVIES.batman),
				release_date: expect.any(Date),
			},
			{
				...Movie.filterData(MOCK_MOVIE_FROM_API),
				release_date: expect.any(Date),
				genres: undefined,
			},
		];
		expect(favorites).toEqual(expectedReturn);
	});
});

describe('removeFavoriteMovie', () => {
	it('removes specified movie from favorites for the specified user', async () => {
		await User.removeFavoriteMovie(
			MOCK_USERS.robbie.id,
			MOCK_MOVIES.batman.api_id
		);
		const favorites = await User.getFavoriteMovies(MOCK_USERS.robbie.id);
		expect(favorites).toEqual([]);
	});
});

describe('getFavoriteTv', () => {
	it('retrieves all favorite tv series belonging to the user with the specified id', async () => {
		const favorites = await User.getFavoriteTv(MOCK_USERS.robbie.id);
		const expectedReturn = {
			...Tv.filterData(MOCK_SERIES.lasso),
			first_air_date: expect.any(Date),
		};
		expect(favorites).toEqual([expectedReturn]);
	});
});

describe('addFavoriteTv', () => {
	it('saves favorited tv series to database and to favorites for the specified user', async () => {
		axios.get.mockResolvedValue({ data: { ...MOCK_SERIES_FROM_API } });
		await User.addFavoriteTv(MOCK_USERS.robbie.id, MOCK_SERIES_FROM_API.id);
		const favorites = await User.getFavoriteTv(MOCK_USERS.robbie.id);
		const expectedReturn = [
			{
				...Tv.filterData(MOCK_SERIES.lasso),
				first_air_date: expect.any(Date),
			},
			{
				...Tv.filterData(MOCK_SERIES_FROM_API),
				first_air_date: expect.any(Date),
				genres: undefined,
			},
		];
		expect(favorites).toEqual(expectedReturn);
	});
});

describe('removeFavoriteTv', () => {
	it('removes specified tv series from favorites for the specified user', async () => {
		await User.removeFavoriteTv(MOCK_USERS.robbie.id, MOCK_SERIES.lasso.api_id);
		const favorites = await User.getFavoriteTv(MOCK_USERS.robbie.id);
		expect(favorites).toEqual([]);
	});
});
