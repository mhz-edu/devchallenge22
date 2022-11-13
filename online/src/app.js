const express = require('express');

const peopleRoutes = require('./routes/people');
const messagesRoutes = require('./routes/messages');
const pathRoutes = require('./routes/path');
const { serverError } = require('./controller/error');

const app = express();

app.use(express.json());
app.use('/api/people', peopleRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/path', pathRoutes);
app.use(serverError);

module.exports = app;
