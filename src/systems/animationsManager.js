import { player } from "../entities/player.js";
import { Sprite } from "../systems/sprite.js";

export const animations = {
  sonicRun: new Sprite("assets/sprites/sonic/sonic.png", player.x, player.y, [
    {
      imageOffsetX: 0,
      imageOffsetY: 8,
      widthPerImage: 32,
      heightPerImage: 36,
      imagesLength: 8
    }
  ], false, 50),

  sonicJump: new Sprite("assets/sprites/sonic/sonic.png", player.x, player.y, [
    {
      imageOffsetX: 0,
      imageOffsetY: 53,
      widthPerImage: 32,
      heightPerImage: 31,
      imagesLength: 8
    }
  ], false, 50),

  ringsAnim: new Sprite("assets/sprites/items/ring.png", 566, 384, [
    {
      imageOffsetX: 0,
      imageOffsetY: 0,
      widthPerImage: 17,
      heightPerImage: 16,
      imagesLength: 16
    }
  ], false, 50),

  motoBugAnim: new Sprite("assets/sprites/enemies/motobug.png", 566, 384, [
    {
      imageOffsetX: 0,
      imageOffsetY: 1,
      widthPerImage: 48,
      heightPerImage: 29,
      imagesLength: 5
    }
  ], false, 100),
};