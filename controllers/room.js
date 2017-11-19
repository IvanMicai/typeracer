const url = require('url');
const { Room } = require('../models/room');

const rooms = {};
const wsClients = [];

const roomController = (req, res) => {
  const { roomname, username } = req.params;

  if (!rooms[roomname]) {
    rooms[roomname] = new Room({ name: roomname });
  }

  rooms[roomname].userJoin(username);
  res.send(Object.assign({ type: 'status' }, rooms[roomname].roomStatus()));
};

const roomStatusController = (req, res) => {
  const { roomname } = req.params;

  if (rooms[roomname]) {
    res.send(rooms[roomname].roomStatus());
  } else {
    res.status(404).send();
  }
};

const closeConnection = ({ room, username }) => {
  let indexToRemove;
  wsClients.forEach((client, index) => {
    if (client.room === room && client.username === username) {
      indexToRemove = index;
    }
  });

  wsClients.splice(indexToRemove, 1);
};

const sendRoomBroadcast = ({ roomname, message }) => {
  wsClients.forEach((client) => {
    if (roomname === client.room) {
      client.ws.send(JSON.stringify(message));
    }
  });
};

const roomMessage = (msg) => {
  const { type, data } = JSON.parse(msg);
  const { roomname, username } = data;

  switch (type) {
    case 'typing':
      rooms[roomname].newUserInput(data);
      break;
    case 'ready':
      rooms[roomname].userReady(username);
      rooms[roomname].start();

      if (rooms[roomname].status === 'running') {
        sendRoomBroadcast({ roomname, message: Object.assign({ type: 'start' }, { text: rooms[roomname].text }) });
      }

      break;
    default:
  }

  sendRoomBroadcast({ username, roomname, message: Object.assign({ type: 'status' }, rooms[roomname].roomStatus()) });
};

const roomWs = (ws, req) => {
  const location = url.parse(req.url, true);
  const { room, username } = location.query;

  wsClients.push({ room, username, ws });

  ws.on('close', () => closeConnection({ room, username }));
  ws.on('message', message => roomMessage(message, rooms));
};


exports.roomController = roomController;
exports.roomStatusController = roomStatusController;
exports.roomWs = roomWs;
