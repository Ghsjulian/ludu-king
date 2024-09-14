const express = require('express');
const app = express();
const server = require('http').createServer(app);

app.use(express.static('public'));

module.exports = app