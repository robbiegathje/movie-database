const express = require('express');
const Movie = require('../models/movie');
const router = new express.Router();

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const movie = await Movie.get(id);
	return res.json({ movie });
});

module.exports = router;
