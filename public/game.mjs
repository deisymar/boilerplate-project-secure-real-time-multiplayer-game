import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import { dimensions, generateStartPos } from './gameConfiguration.mjs'

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

// Preload game assets
const loadImage = (src) => {
  const img = new Image();
  img.src = src;
  return img;
};

const bronzeCoin = loadImage('../images/bronze-coin.png');
const goldCoin = loadImage('../images/gold-coin.png');
const silverCoin = loadImage('../images/silver-coin.png');
const mainPlayer = loadImage('../images/main-player.png');
const otherPlayer = loadImage('../images/other-player.png');

