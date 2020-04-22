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

io.on("connection", (socket) => {
  console.log("socket connected");
  socket.on("paint", function (data) {
    console.log(data);
    socket.broadcast.emit("paint", data);
  });

  socket.on("setColor", function (data) {
    socket.broadcast.emit("setColor", data);
  });

  socket.on("setWidth", function (data) {
    socket.broadcast.emit("setWidth", data);
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
