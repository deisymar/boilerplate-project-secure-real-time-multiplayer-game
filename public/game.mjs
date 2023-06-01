import Player from "./Player.mjs";
import Collectible from "./Collectible.mjs";
import {
  dimensions,
  backgroundGame,
  generateStartPos,
  avatar,
} from "./gameConfiguration.mjs";

//const { io } = require("socket.io-client");
//import { io } from "socket.io-client";
//const { nanoid } = require("nanoid").nanoid;
//import { nanoid } from "nanoid";
//const idn = nanoid();

const socket = io();
const canvas = document.getElementById("game-window");
const context = canvas.getContext("2d");

// Preload game assets
const loadImage = (src) => {
  const myImage = new Image();
  myImage.src = src;
  return myImage;
};

const mainPlayer = loadImage(avatar.player.playerSrc);
const otherPlayer = loadImage(avatar.player.otherPlayerSrc);
const coinAvatar = avatar.collectibleSprite.coinSrc.map((src) => {
  return loadImage(src);
});

let player;
//let playerRank = "Rank:  /  ";

let allPlayers = [];
let speed = 10;
let collectibleBuffer = dimensions.playFieldLeft;
let endGame = 0;
// create new player
let posPlayer = generateStartPos(
  dimensions.playFieldWidth,
  dimensions.playFieldHeight,
  avatar.player
);

const localPlayer = new Player({
  x: posPlayer.x,
  y: posPlayer.y,
  score: 0,
  //id: nanoid,
  id: Date.now(),
});

// create bonus Coin
const getNewCoin = () => {
  let posCoin = generateStartPos(
    dimensions.playFieldWidth,
    dimensions.playFieldHeight,
    avatar.collectibleSprite
  );

  const getRandomColorBonus = () => {
    let prob = Math.floor(Math.random() * 100);

    if (prob <= 35) {
      return 0;
    } else if (prob <= 65) {
      return 1;
    }
    return 2;
  };

  let newCoin = new Collectible({
    x: posCoin.x,
    y: posCoin.y,
    //id: nanoid,
    id: Date.now(),
    spriteSrcIndex: getRandomColorBonus(),
  });
  return newCoin;
};

let bonus = getNewCoin();

// control move
const getKey = (e) => {
  if (e.keyCode === 87 || e.keyCode === 38) return "up";
  if (e.keyCode === 83 || e.keyCode === 40) return "down";
  if (e.keyCode === 65 || e.keyCode === 37) return "left";
  if (e.keyCode === 68 || e.keyCode === 39) return "right";
};

document.onkeydown = (e) => {
  //document.onkeypress = (e) => {
  let dir = getKey(e);
  if (dir) {
    localPlayer.dir = dir;
    window.requestAnimationFrame(draw);
    localPlayer.movePlayer(dir, 10);
    socket.emit("updateServerPlayers", { allPlayers, localPlayer, bonus });
  }
};

document.onkeyup = (e) => {
  let dir = getKey(e);
  if (localPlayer && dir) {
    localPlayer.dir = null;
    socket.emit("updateServerPlayers", { allPlayers, localPlayer, bonus });
  }
};

// draw game
const draw = () => {
  //draw backgroundGame
  backgroundGame.clearCanvas();
  backgroundGame.drawCanvas();
  backgroundGame.drawHeading();

  // draw bonus
  if (bonus) {
    bonus.draw(context, coinAvatar);
  }

  // draw players
  allPlayers.forEach((player) => {
    const p = new Player(player);
    if (p.id === localPlayer.id) {
      p.local = true; // make local player unique
      p.draw(context, mainPlayer);
    } else {
      p.draw(context, otherPlayer);
    }
  });

  //checked collision
  if (localPlayer && bonus) {
    if (localPlayer.collision(bonus)) {
      //En Player estoy sumando score
      //localPlayer.score += bonus.value;
      const winningPlayer = allPlayers.findIndex((p) => p.id == localPlayer.id);

      allPlayers[winningPlayer].score = localPlayer.score;
      if (allPlayers[winningPlayer].score >= 5) {
        endGame = allPlayers[winningPlayer].score;
      }
      bonus = getNewCoin();

      localPlayer.calculateRank(allPlayers);
      socket.emit("updateServerPlayers", { allPlayers, localPlayer, bonus });
    }
  }
  localPlayer.calculateRank(allPlayers);
};

socket.on("connected", (connected) => {
  window.requestAnimationFrame(draw);
  socket.emit("init", { allPlayers, localPlayer, bonus });
  console.log(`${connected.msg}, Currently ${connected.connections} player(s)`);
});

// when a player updates server-side
socket.on("updateClientPlayers", (data) => {
  allPlayers = data.allPlayers;
  //bonus = new Collectible(data.bonus);

  window.requestAnimationFrame(draw);
});

socket.on("endGameClient", (endgame) => {
  console.log("fin");
});

socket.on("disconnected", (connected) => {
  console.log(`${connected.msg}, Currently ${connected.connections} player(s)`);
});
