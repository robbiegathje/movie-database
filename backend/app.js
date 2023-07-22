const express = require('express');
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const searchRoutes = require('./routes/search');
const tvRoutes = require('./routes/tv');
const userRoutes = require('./routes/users');
const { authenticateJWT } = require('./middleware/auth');
const { NotFoundError } = require('./expressError');
const { INTERNAL_SERVER_ERROR } = require('./errorMessages');

const app = express();

app.use(express.json());
app.use(authenticateJWT);

app.use('/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/tv', tvRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
	return next(new NotFoundError());
});

app.use((err, req, res, next) => {
	const status = err.status || 500;
	const message = err.message || INTERNAL_SERVER_ERROR;
	return res.status(status).json({ error: { message, status } });
});

module.exports = app;
