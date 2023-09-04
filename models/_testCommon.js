const bcrypt = require('bcrypt');
const db = require('../db');
const { bcryptWorkFactor } = require('../config');

const MOCK_USERS = {
	robbie: { username: 'robbie', password: 'testing123' },
	carly: { username: 'carlyg', password: 'testing123' },
};

const MOCK_GENRES = {
	action: { api_id: 123, name: 'action' },
	drama: { api_id: 456, name: 'drama' },
};

const MOCK_MOVIES = {
	batman: {
		api_id: 1,
		imdb_id: 'm2',
		title: 'Batman',
		tagline: 'The Dark Knight',
		overview: 'He comes in the night.',
		poster_path: 'batmanposter.jpeg',
		release_date: '2023-09-03',
		runtime: 123,
	},
};

const MOCK_SERIES = {
	lasso: {
		api_id: 1,
		imdb_id: 't2',
		name: 'Ted Lasso',
		tagline: 'Believe!',
		overview: 'A show about soccer... and life... and relationships.',
		poster_path: 'tedlassoposter.jpeg',
		first_air_date: '2023-09-03',
		seasons: 3,
		episodes: 24,
		status: 'Continuing Series',
	},
};

async function commonBeforeAll() {
	await db.query('DELETE FROM favorited_movies');
	await db.query('DELETE FROM favorited_tv');
	await db.query('DELETE FROM users');
	await db.query('DELETE FROM movie_genres');
	await db.query('DELETE FROM tv_genres');
	await db.query('DELETE FROM genres');
	await db.query('DELETE FROM movies');
	await db.query('DELETE FROM tv');

	const userResults = await db.query(
		`INSERT INTO users (username, password)
		VALUES ($1, $2),
		($3, $4)
		RETURNING id`,
		[
			MOCK_USERS.robbie.username,
			await bcrypt.hash(MOCK_USERS.robbie.password, bcryptWorkFactor),
			MOCK_USERS.carly.username,
			await bcrypt.hash(MOCK_USERS.carly.password, bcryptWorkFactor),
		]
	);
	MOCK_USERS.robbie.id = userResults.rows[0].id;
	MOCK_USERS.carly.id = userResults.rows[1].id;

	const genreResults = await db.query(
		`INSERT INTO genres (api_id, name)
		VALUES ($1, $2),
		($3, $4)
		RETURNING id`,
		[
			MOCK_GENRES.action.api_id,
			MOCK_GENRES.action.name,
			MOCK_GENRES.drama.api_id,
			MOCK_GENRES.drama.name,
		]
	);
	MOCK_GENRES.action.id = genreResults.rows[0].id;
	MOCK_GENRES.drama.id = genreResults.rows[1].id;

	const movieResults = await db.query(
		`INSERT INTO movies (api_id, imdb_id, title, tagline, overview, poster_path, release_date, runtime)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id`,
		[
			MOCK_MOVIES.batman.api_id,
			MOCK_MOVIES.batman.imdb_id,
			MOCK_MOVIES.batman.title,
			MOCK_MOVIES.batman.tagline,
			MOCK_MOVIES.batman.overview,
			MOCK_MOVIES.batman.poster_path,
			MOCK_MOVIES.batman.release_date,
			MOCK_MOVIES.batman.runtime,
		]
	);
	MOCK_MOVIES.batman.id = movieResults.rows[0].id;
	delete MOCK_MOVIES.batman.release_date;

	await db.query(
		`INSERT INTO movie_genres (movie_id, genre_id)
		VALUES ($1, $2)`,
		[MOCK_MOVIES.batman.id, MOCK_GENRES.action.id]
	);

	const tvResults = await db.query(
		`INSERT INTO tv (api_id, imdb_id, name, tagline, overview, poster_path, first_air_date, seasons, episodes, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id`,
		[
			MOCK_SERIES.lasso.api_id,
			MOCK_SERIES.lasso.imdb_id,
			MOCK_SERIES.lasso.name,
			MOCK_SERIES.lasso.tagline,
			MOCK_SERIES.lasso.overview,
			MOCK_SERIES.lasso.poster_path,
			MOCK_SERIES.lasso.first_air_date,
			MOCK_SERIES.lasso.seasons,
			MOCK_SERIES.lasso.episodes,
			MOCK_SERIES.lasso.status,
		]
	);
	MOCK_SERIES.lasso.id = tvResults.rows[0].id;
	delete MOCK_SERIES.lasso.first_air_date;

	await db.query(
		`INSERT INTO tv_genres (tv_id, genre_id)
		VALUES ($1, $2)`,
		[MOCK_SERIES.lasso.id, MOCK_GENRES.drama.id]
	);

	await db.query(
		`INSERT INTO favorited_movies (user_id, movie_id)
		VALUES ($1, $2)`,
		[MOCK_USERS.robbie.id, MOCK_MOVIES.batman.id]
	);

	await db.query(
		`INSERT INTO favorited_tv (user_id, tv_id)
		VALUES ($1, $2)`,
		[MOCK_USERS.robbie.id, MOCK_SERIES.lasso.id]
	);
}

async function commonBeforeEach() {
	await db.query('BEGIN');
}

async function commonAfterEach() {
	await db.query('ROLLBACK');
}

async function commonAfterAll() {
	await db.end();
}

module.exports = {
	MOCK_USERS,
	MOCK_GENRES,
	MOCK_MOVIES,
	MOCK_SERIES,
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
};
