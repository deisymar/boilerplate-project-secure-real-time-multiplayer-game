import { avatar, dimensions } from "./gameConfiguration.mjs";

class Collectible {
  constructor({ x = 10, y = 10, value = 1, id, spriteSrcIndex = 0 }) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.spriteSrcIndex = spriteSrcIndex;
  }

  draw(context, imgObj) {
    const x = this.x + dimensions.playFieldLeft;
    const y = this.y + dimensions.playFieldTop;
    const imgBonus = imgObj[this.spriteSrcIndex];
    context.drawImage(
      imgBonus,
      x,
      y,
      avatar.collectibleSprite.width,
      avatar.collectibleSprite.height
    );
  }
  setState({ x, y, value = 1, id, spriteSrcIndex }) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.spriteSrcIndex = spriteSrcIndex;
  }
}

/*

  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch (e) {}

export default Collectible;
//module.exports = Collectible;
