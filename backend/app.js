const express = require('express');
const movieRoutes = require('./routes/movies');
const searchRoutes = require('./routes/search');

const app = express();

app.use(express.json());

app.use('/api/movies', movieRoutes);
app.use('/api/search', searchRoutes);

module.exports = app;
