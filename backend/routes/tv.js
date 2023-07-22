const express = require('express');
const Tv = require('../models/tv');
const router = new express.Router();

router.get('/:id', async (req, res, next) => {
	const id = req.params.id;
	try {
		const series = await Tv.get(id);
		return res.json({ series });
	} catch (error) {
		return next(error);
	}
});

router.post('/:id', async (req, res, next) => {
	const id = req.params.id;
	try {
		const series = await Tv.save(id);
		return res.json({ series });
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
