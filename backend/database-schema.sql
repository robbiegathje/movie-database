CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(20) NOT NULL UNIQUE,
	password TEXT NOT NULL
);

CREATE TABLE collections (
	id SERIAL PRIMARY KEY,
	api_id INTEGER NOT NULL UNIQUE,
	collection TEXT NOT NULL UNIQUE,
	poster_url TEXT
);

CREATE TABLE movies (
	id SERIAL PRIMARY KEY,
	api_id INTEGER NOT NULL UNIQUE,
	imdb_id INTEGER NOT NULL UNIQUE,
	title TEXT NOT NULL,
	tagline TEXT,
	overview TEXT,
	poster_url TEXT,
	collection_id INTEGER REFERENCES collections,
	release_date DATE,
	runtime INTEGER
);

CREATE TABLE tv (
	id SERIAL PRIMARY KEY,
	api_id INTEGER NOT NULL UNIQUE,
	imdb_id INTEGER NOT NULL UNIQUE,
	name TEXT NOT NULL,
	tagline TEXT,
	overview TEXT,
	poster_url TEXT,
	first_air_date DATE,
	seasons INTEGER,
	episodes INTEGER,
	status TEXT
);

CREATE TABLE genres (
	id SERIAL PRIMARY KEY,
	api_id INTEGER NOT NULL UNIQUE,
	genre TEXT NOT NULL UNIQUE
);

CREATE TABLE favorited_movies (
	id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL REFERENCES users,
	movie_id INTEGER NOT NULL REFERENCES movies,
	UNIQUE (user_id, movie_id)
);

CREATE TABLE favorited_tv (
	id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL REFERENCES users,
	tv_id INTEGER NOT NULL REFERENCES tv,
	UNIQUE (user_id, tv_id)
);

CREATE TABLE movie_genres (
	id SERIAL PRIMARY KEY,
	genre_id INTEGER NOT NULL REFERENCES genres,
	movie_id INTEGER NOT NULL REFERENCES movies,
	UNIQUE (genre_id, movie_id)
);

CREATE TABLE tv_genres (
	id SERIAL PRIMARY KEY,
	genre_id INTEGER NOT NULL REFERENCES genres,
	tv_id INTEGER NOT NULL REFERENCES tv,
	UNIQUE (genre_id, tv_id)
);