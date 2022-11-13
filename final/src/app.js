const express = require('express');

const imageRoutes = require('./routes/images');
const { serverError } = require('./controller/error');

const app = express();

app.use(express.json({ limit: '200kb' }));
app.use('/api/image-input', imageRoutes);
app.use(serverError);

module.exports = app;
