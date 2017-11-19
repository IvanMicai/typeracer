'use strict';

const express = require('express');
const http = require('http');

const { roomController, roomStatusController } = require('./controllers/rooms')

const app = express();
const server = http.createServer(app);

app.use(express.static('public'));

app.get('/room/:roomname/user/:username', (req, res) => roomController(req, res));
app.get('/room/:roomname', (req, res) => roomStatusController(req, res));

server.listen(8080, () => console.log('Listening on http://localhost:8080'));