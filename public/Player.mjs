import { dimensions, backgroundGame, avatar } from "./gameConfiguration.mjs";

class Player {
  constructor({ x = 10, y = 10, score = 0, id, local = false }) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
    this.speed = 5;
    this.local = local;
    this.dir = null;
  }

  movePlayer(dir, speed) {
    switch (dir) {
      case "up":
        this.y =
          this.y - speed >= dimensions.playFieldMinY ? this.y - speed : speed;
        break;
      case "down":
        this.y =
          this.y + speed <= dimensions.playFieldHeight - avatar.player.height
            ? this.y + speed
            : this.y + 0;
        break;
      case "right":
        this.x =
          this.x + speed <= dimensions.playFieldWidth - avatar.player.width
            ? this.x + speed
            : this.x + 0;
        break;
      case "left":
        this.x =
          this.x - speed >= dimensions.playFieldMinX
            ? this.x - speed
            : this.x - 0;
        break;
      default:
        this.x = this.x;
        this.y = this.y;
    }
  }

  collision(item) {
    const xCollision = !(
      this.x > item.x + avatar.collectibleSprite.width ||
      this.x + avatar.player.width < item.x
    );

    const yCollision = !(
      this.y > item.y + avatar.collectibleSprite.height ||
      this.y + avatar.player.height < item.y
    );

    if (xCollision && yCollision) {
      this.score += 1;
      return true;
    }
    return false;
  }

  calculateRank(arrPlayers) {
    const numPlayers = arrPlayers.length;
    let rank;

    if (this.score === 0) {
      rank = numPlayers;
    } else {
      const sortedPlayers = arrPlayers.sort(
        (playerA, playerB) => playerB.score - playerA.score
      );
      rank = sortedPlayers.findIndex((player) => player.id === this.id) + 1;
    }
    const rankingText = `Rank: ${rank} / ${numPlayers}`;
    backgroundGame.drawRank(rankingText);
    return rankingText;
  }

  draw(context, image) {
    if (this.dir) {
      this.movePlayer(this.dir, this.speed);
    }
    const x = this.x + dimensions.playFieldLeft;
    const y = this.y + dimensions.playFieldTop;
    context.drawImage(image, x, y, avatar.player.width, avatar.player.height);
  }
}

export default Player;
