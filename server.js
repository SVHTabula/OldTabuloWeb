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

const socketToRoom = new Map();
const rooms = new Map();

io.on("connection", (socket) => {
  socket.on('disconnect', () => {
    const room = socketToRoom.get(getRoomId());
    if (room && room.teacher === socket.id) {
      for (const socketId of room.students) {
        socket.to(socketId).emit('leaveRoom');
      }
      rooms.delete(getRoomId());
    }
  });

  socket.on('joinRoom', ({id: roomId, password: roomPassword}, fn) => {
    const room = rooms.get(roomId);
    console.log(roomId);
    console.log(JSON.stringify(room));
    if (room && room.joinPassword === roomPassword) {
      socket.join(roomId);
      room.students.push(socket.id);
      socketToRoom.set(socket.id, roomId);
      setupCanvas(room);
      fn({success: true});
    } else {
      fn({success: false, message: 'Invalid room ID or incorrect password.'});
    }
  });

  socket.on('createRoom', ({id: roomId, password: joinPassword}, fn) => {
    if (rooms.has(roomId)) {
      fn({success: false, message: 'Room already exists.'});
    } else {
      socket.join(roomId);
      socketToRoom.set(socket.id, roomId);
      const adminPassword = v4().slice(-6);
      rooms.set(roomId, {
        teacher: socket.id,
        teacherDevice: null,
        students: [],
        joinPassword: joinPassword,
        adminPassword: adminPassword,
        color: '#000000',
        width: 5,
        canvasBounds: {width: 100, height: 100},
        phoneBounds: {x: 0, y: 0, width: 100, height: 100}
      });
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
    const room = rooms.get(roomId);
    console.log([...rooms]);
    console.log(JSON.stringify(room));
    if (room && room.adminPassword === password) {
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
    return socketToRoom.get(socket.id);
  }

  function isTeacher() {
    const room = rooms.get(getRoomId()) || {};
    return room.teacher === socket.id || room.teacherDevice === socket.id;
  }

  socket.on("paint", function (lines) {
    if (!isTeacher()) return;
    socket.to(getRoomId()).broadcast.emit("paint", lines);
  });

  socket.on("setColor", function (color) {
    if (!isTeacher()) return;
    const roomId = getRoomId();
    rooms.get(roomId).color = color;
    socket.to(roomId).broadcast.emit("setColor", color);
  });

  socket.on("setWidth", function (width) {
    if (!isTeacher()) return;
    const roomId = getRoomId();
    rooms.get(roomId).width = width;
    socket.to(roomId).broadcast.emit("setWidth", width);
  });

  socket.on("setPhoneBounds", function (phoneBounds) {
    if (!isTeacher()) return;
    const roomId = getRoomId();
    rooms.get(roomId).phoneBounds = phoneBounds;
    socket.to(roomId).broadcast.emit("setPhoneBounds", phoneBounds);
  });

  socket.on("setCanvasBounds", function (canvasBounds) {
    if (!isTeacher()) return;
    const roomId = getRoomId();
    rooms.get(roomId).canvasBounds = canvasBounds;
    socket.to(roomId).broadcast.emit("setCanvasBounds", canvasBounds);
  });

  socket.on("updateImage", function (image) {
    if (!isTeacher()) return;
    socket.to(getRoomId()).broadcast.emit("updateImage", image);
  });

  socket.on("clearCanvas", function (data) {
    if (!isTeacher()) return;
    socket.to(getRoomId()).broadcast.emit("clearCanvas", data);
  });

  socket.on("setIsBlackboardMode", function (isBlackboardMode) {
    if (!isTeacher()) return;
    socket.to(getRoomId()).broadcast.emit("setIsBlackboardMode", isBlackboardMode);
  });


});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
