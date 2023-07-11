const express = require('express');
const Movie = require('../models/movie');
const router = new express.Router();

router.get('/movies', async (req, res) => {
	const query = req.query.query;
	const results = await Movie.search(query);
	return res.json({ results });
});

module.exports = router;
