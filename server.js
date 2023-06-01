require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const expect = require("chai");
const socket = require("socket.io");
const helmet = require("helmet");
const nocache = require("nocache");
const cors = require("cors");

const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner.js");

const app = express();
const server = require("http").createServer(app);
const io = socket(server, { cors: { origin: "*" } });

app.use(
  helmet({
    noSniff: true,
    xssFilter: true,
    hidePoweredBy: {
      setTo: "PHP 7.4.3",
    },
  })
);

app.use(nocache());

app.use("/public", express.static(process.cwd() + "/public"));
app.use("/assets", express.static(process.cwd() + "/assets"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({ origin: "*" }));

// Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
//const server = app.listen(portNum, () => {
server.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log("Tests are not valid:");
        console.error(error);
      }
    }, 1500);
  }
});

// Socket.io setup to the same port
//const io = socket(server);

//let currPlayers = [];
//const destroyedCoins = [];
const connections = [];
let allPlayers = [];
let bonus = {};
let endgame = 0;

//io.sockets.on("connection", (socket) => {
io.on("connection", (socket) => {
  //console.log(`New connection ${socket.id}`);
  connections.push(socket);
  io.emit("connected", {
    msg: `Connected ${socket.id}`,
    connections: connections.length,
  });
  socket.on("init", (data) => {
    data.localPlayer.socketId = socket.id;
    if (
      !allPlayers.includes(
        allPlayers.find(
          (player) => player.socketId === data.localPlayer.socketId
        )
      )
    ) {
      allPlayers.push(data.localPlayer);
    }
    io.emit("updateClientPlayers", { allPlayers, bonus });
  });

  socket.on("updateServerPlayers", (data) => {
    //console.log(data);
    // update goal from client
    bonus = data.bonus;
    // get index of player who triggered update
    const player = allPlayers.findIndex(
      (player) => player.id == data.localPlayer.id
    );
    // update player by index
    allPlayers[player].x = data.localPlayer.x;
    allPlayers[player].y = data.localPlayer.y;
    allPlayers[player].score = data.localPlayer.score;

    if (allPlayers[player].score >= 3) {
      endgame = allPlayers[player].score;
      io.emit("endGameClient", { endgame });
    }

    io.emit("updateClientPlayers", { allPlayers, bonus });
  });

  // remove player from list of all players by associated the socket id
  socket.on("disconnect", () => {
    connections.splice(connections.indexOf(socket), 1);
    allPlayers = allPlayers.filter((player) => player.socketId !== socket.id);
    io.emit("updateClientPlayers", { allPlayers, bonus });
    socket.broadcast.emit("disconnected", {
      msg: `${socket.id} disconnected`,
      connections: connections.length,
    });
  });
});

//module.exports = app; // For testing
module.exports = server;
