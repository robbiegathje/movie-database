const express = require('express');
const Tv = require('../models/tv');
const router = new express.Router();

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const series = await Tv.get(id);
	return res.json({ series });
});

module.exports = router;
