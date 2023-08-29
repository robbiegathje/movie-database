const express = require('express');
const Movie = require('../models/movie');
const Tv = require('../models/tv');
const router = new express.Router();

router.get('/movies', async (req, res) => {
	const query = req.query.query;
	const results = await Movie.search(query);
	return res.json({ results });
});

router.get('/tv', async (req, res) => {
	const query = req.query.query;
	const results = await Tv.search(query);
	return res.json({ results });
});

module.exports = router;
