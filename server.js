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
const server = app.listen(portNum, () => {
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
const Collectible = require("./public/Collectible.mjs");
const {
  dimensions,
  generateStartPos,
} = require("./public/gameConfiguration.mjs");

let currPlayers = [];
const destroyedCoins = [];

const generateCoin = () => {
  const rand = Math.random();
  let coinValue;

  if (rand < 0.6) {
    coinValue = 1;
  } else if (rand < 0.85) {
    coinValue = 2;
  } else {
    coinValue = 3;
  }

  return new Collectible({
    //x: generateStartPos(dimensions.playFieldMinX, dimensions.playFieldMaxX, 5),
    //y: generateStartPos(dimensions.playFieldMinY, dimensions.playFieldMaxY, 5),
    x: 25,
    y: 25,
    value: coinValue,
    id: Date.now(),
  });
};

let coin = generateCoin();

/*io.sockets.on("connection", (socket) => {
  console.log(`New connection ${socket.id}`);

  // socket.emit("init", { id: socket.id, players: currPlayers, coin });
});*/

module.exports = app; // For testing
