const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const { roomController, roomStatusController, roomWs } = require('./controllers/rooms')

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

wss.on('connection', (ws, req) => roomWs(ws, req));
app.get('/room/:roomname/user/:username', (req, res) => roomController(req, res));
app.get('/room/:roomname', (req, res) => roomStatusController(req, res));

server.listen(8080, () => console.log('Listening on http://localhost:8080'));