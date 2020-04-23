require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
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

let canvasBounds = {width: 100, height: 100};
let phoneBounds = {x: 0, y: 0, width: 100, height: 100};
let color = '#ffffff';
let width = 5;

const rooms = {
  /*
    id: {
      teacher: 'socketId',
      members: ['socketId', 'socketId']
    }
  */
};

io.on("connection", (socket) => {
  socket.on('joinRoom', (room, fn) => {
    if (rooms[room]) {
      socket.join(room);
      rooms[room].students.push(socket.id);
      fn({success: true});
    }
    fn({success: false, message: 'Room not found.'});
  });

  socket.on('createRoom', (room, fn) => {
    if (rooms[room]) {
      fn({success: false, message: 'Room already exists.'});
    }
    socket.join(room);
    rooms[room] = {teacher: socket.id, students: []};
    fn({success: true});
  });

  socket.emit("setCanvasBounds", canvasBounds);
  socket.emit("setPhoneBounds", phoneBounds);
  socket.emit("setColor", color);
  socket.emit("setWidth", width);

  socket.on("paint", function (data) {
    socket.broadcast.emit("paint", data);
  });

  socket.on("setColor", function (data) {
    color = data;
    socket.broadcast.emit("setColor", data);
  });

  socket.on("setWidth", function (data) {
    width = data;
    socket.broadcast.emit("setWidth", data);
  });

  socket.on("setPhoneBounds", function (data) {
    phoneBounds = data;
    socket.broadcast.emit("setPhoneBounds", data);
  });

  socket.on("setCanvasBounds", function (data) {
    canvasBounds = data;
    socket.broadcast.emit("setCanvasBounds", data);
  });

  socket.on("updateImage", function (data) {
    socket.broadcast.emit("updateImage", data);
  });

  socket.on("clearCanvas", function (data) {
    socket.broadcast.emit("clearCanvas", data);
  })
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
