require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { v4 } = require('uuid');
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const server = require("http").Server(app);
const io = require("socket.io")(server);

const rooms = {
  /*
    id: {
      teacher: 'socketId',
      teacherDevice: 'socketId'
      joinPassword: joinPassword,
      adminPassword: adminPassword
      members: ['socketId', 'socketId']
    }
  */
};

const socketToRoom = new Map();

io.on("connection", (socket) => {
  socket.on('joinRoom', ({id: roomId, password: roomPassword}, fn) => {
    if (rooms[roomId] && rooms[roomId].joinPassword === roomPassword) {
      const room = rooms[roomId];
      socket.join(roomId);
      room.students.push(socket.id);
      socketToRoom.set(socket.id, roomId);
      setupCanvas(room);
      fn({success: true});
    } else {
      fn({success: false, message: 'Invalid room ID or incorrect password.'});
    }
  });

  socket.on('createRoom', ({id: roomId, joinPassword}, fn) => {
    if (rooms[roomId]) {
      fn({success: false, message: 'Room already exists.'});
    } else {
      socket.join(roomId);
      socketToRoom.set(socket.id, roomId);
      const adminPassword = v4().slice(-6);
      rooms[roomId] = {
        teacher: socket.id,
        teacherDevice: null,
        students: [],
        joinPassword: joinPassword,
        adminPassword: adminPassword,
        color: '#ffffff',
        width: 5,
        canvasBounds: {width: 100, height: 100},
        phoneBounds: {x: 0, y: 0, width: 100, height: 100}
      };
      fn({success: true, adminPassword});
    }
  });

  function setupCanvas(room) {
    socket.emit("setCanvasBounds", room.canvasBounds);
    socket.emit("setPhoneBounds", room.phoneBounds);
    socket.emit("setColor", room.color);
    socket.emit("setWidth", room.width)
  }

  socket.on('connectToRoom', ({id: roomId, password}, fn) => {
    if (rooms[roomId] && rooms[roomId].adminPassword === password) {
      const room = rooms[roomId];
      socket.join(roomId);
      room.teacherDevice = socket.id;
      socketToRoom.set(socket.id, roomId);
      setupCanvas(room);
      fn({success: true});
    } else {
      fn({success: false, message: 'Invalid room ID or incorrect password.'});
    }
  });

  function getRoomId() {
    return socketToRoom[socket.id];
  }

  function isTeacher() {
    const room = rooms[getRoomId()];
    return room.teacher === socket.id || room.teacherDevice === socket.id;
  }

  socket.on("paint", function (lines) {
    if (!isTeacher()) return;
    socket.to(getRoomId()).broadcast.emit("paint", lines);
  });

  socket.on("setColor", function (color) {
    if (!isTeacher()) return;
    const roomId = getRoomId();
    rooms[roomId].color = color;
    socket.to(roomId).broadcast.emit("setColor", color);
  });

  socket.on("setWidth", function (width) {
    if (!isTeacher()) return;
    const roomId = getRoomId();
    rooms[roomId].width = width;
    socket.to(roomId).broadcast.emit("setWidth", width);
  });

  socket.on("setPhoneBounds", function (phoneBounds) {
    if (!isTeacher()) return;
    const roomId = getRoomId();
    rooms[roomId].phoneBounds = phoneBounds;
    socket.to(roomId).broadcast.emit("setPhoneBounds", data);
  });

  socket.on("setCanvasBounds", function (canvasBounds) {
    if (!isTeacher()) return;
    const roomId = getRoomId();
    rooms[roomId].canvasBounds = canvasBounds;
    socket.to(roomId).broadcast.emit("setCanvasBounds", data);
  });

  socket.on("updateImage", function (image) {
    if (!isTeacher()) return;
    const roomId = getRoomId();
    socket.to(roomId).broadcast.emit("updateImage", image);
  });

  socket.on("clearCanvas", function (data) {
    if (!isTeacher()) return;
    const roomId = getRoomId();
    socket.to(roomId).broadcast.emit("clearCanvas", data);
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
