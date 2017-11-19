const { Room } = require('../models/room');

const rooms = {};

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
    res.status(404).send()
  }

};

exports.roomController = roomController;
exports.roomStatusController = roomStatusController;
