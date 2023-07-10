const express = require('express');
const movieRoutes = require('./routes/movies');

const app = express();

app.use(express.json());

app.use('/api/movies', movieRoutes);

module.exports = app;
