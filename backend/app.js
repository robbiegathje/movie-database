const express = require('express');
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const searchRoutes = require('./routes/search');
const tvRoutes = require('./routes/tv');
const userRoutes = require('./routes/users');
const { authenticateJWT } = require('./middleware/auth');

const app = express();

app.use(express.json());
app.use(authenticateJWT);

app.use('/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/tv', tvRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
