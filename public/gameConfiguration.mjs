const canvas = document.getElementById("game-window");
const context = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const playerWidth = 30;
const playerHeight = 30;
const padding = 5; // Between edge of canvas and play field
const infoBar = 45;
const border = 10;
const posTitleY = 32.5;

const dimensions = {
  canvasWidth: canvasWidth,
  canvasHeight: canvasHeight,
  playFieldLeft: padding,
  playFieldTop: infoBar,
  playFieldMinX: canvasWidth / 2 - (canvasWidth - 10) / 2,
  playFieldMinY: canvasHeight / 2 - (canvasHeight - 100) / 2,
  playFieldWidth: canvasWidth - padding * 2,
  playFieldHeight: canvasHeight - infoBar - padding * 2,
  playFieldMaxX: canvasWidth - playerWidth - padding,
  playFieldMaxY: canvasHeight - playerHeight - padding,
};

const backgroundGame = {
  //Play field border
  clearCanvas: () => {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
  },

  drawCanvas: () => {
    context.fillStyle = "#220";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    // Create border for play field
    context.strokeStyle = "white";
    context.strokeRect(
      dimensions.playFieldMinX,
      dimensions.playFieldMinY,
      dimensions.playFieldWidth,
      dimensions.playFieldHeight
    );
  },

  drawHeading: () => {
    // Controls text
    context.fillStyle = "white";
    context.font = `13px 'Press Start 2P'`;
    context.textAlign = "start";
    context.fillText("Controls: WASD", border, posTitleY);

    // Game title
    context.font = `14px 'Press Start 2P'`;
    context.textAlign = "center";
    context.fillText("Coin Race", dimensions.canvasWidth / 2, posTitleY);
  },

  drawRank: (playerRank) => {
    //Player's rank
    context.font = `13px 'Press Start 2P'`;
    context.textAlign = "end";
    context.fillText(
      `${playerRank}`,
      dimensions.canvasWidth - border,
      posTitleY
    );
  },
};

const avatar = {
  player: {
    width: 30,
    height: 30,
    playerSrc:
      "https://cdn.freecodecamp.org/demo-projects/images/main-player.png",
    otherPlayerSrc:
      "https://cdn.freecodecamp.org/demo-projects/images/other-player.png",
    //playerSrc: "/images/main-player.png",
    //otherPlayerSrc: "/images/other-player.png",
  },
  collectibleSprite: {
    width: 20,
    height: 20,
    coinSrc: [
      "https://cdn.freecodecamp.org/demo-projects/images/bronze-coin.png",
      "https://cdn.freecodecamp.org/demo-projects/images/gold-coin.png",
      "https://cdn.freecodecamp.org/demo-projects/images/silver-coin.png",
    ],
    /*coinSrc: [
      "/images/bronze-coin.png",
      "/images/gold-coin.png",
      "/images/silver-coin.png",
    ],*/
  },
};

const generateStartPos = (playFieldWidth, playFieldHeight, imgObj) => {
  return {
    x: Math.floor(Math.random() * (playFieldWidth - imgObj.width)),
    y: Math.floor(Math.random() * (playFieldHeight - imgObj.height)),
  };
};

export { dimensions, backgroundGame, generateStartPos, avatar };
//module.export = { dimensions, generateStartPos };
