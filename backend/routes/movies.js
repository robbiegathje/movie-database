const express = require('express');
const Movie = require('../models/movie');
const router = new express.Router();

router.get('/:id', async (req, res, next) => {
	const id = req.params.id;
	try {
		const movie = await Movie.get(id);
		return res.json({ movie });
	} catch (error) {
		return next(error);
	}
});

router.post('/:id', async (req, res, next) => {
	const id = req.params.id;
	try {
		const movie = await Movie.save(id);
		return res.json({ movie });
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
