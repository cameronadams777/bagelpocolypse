import Bagel from "./game/bagel";
import CreamCheese from "./game/cream-cheese";
import GameObject from "./game/game-object";
import Player from "./game/player";
import Salmon from "./game/salmon";
import Level from "./game/level";
import { getRandomArbitrary } from "./helpers";

import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");

if (!canvas) throw new Error("No canvas element found")

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

if (!ctx) throw new Error("No context found")

const PLAYER_TAG = "player";
const BAGEL_TAG = "bagel";
const SALMON_TAG = "salmon";
const CREAM_CHEESE_TAG = "cream_cheese";

let PLAYER_SPEED: number = 5;

const floor = 1;
const player = new Player(PLAYER_TAG, 50, 50, 40, 60);
const salmon = new Salmon(SALMON_TAG, 500, 500, 50, 50);
const creamCheese = new CreamCheese(CREAM_CHEESE_TAG, 250, 250, 50, 50);
const level = new Level(canvas);

const generateBagels = (): Bagel[] => {
  let attempts = 0;
  const bagels: Bagel[] = [];
  const enemyMaxCount = floor * 3;
  while (bagels.length < enemyMaxCount) {
    if (attempts >= 3) {
      if (bagels.length > 1) {
        break;
      }
      attempts = 0;
    }
    const x = getRandomArbitrary(0, canvas.width - 100);
    const y = getRandomArbitrary(0, canvas.height - 100);
    const bagel = new Bagel(BAGEL_TAG, x, y, 50, 50);
    if (!bagels.some(b => !b.isCollidingWith(bagel))) {
      bagels.push(bagel);
      continue;
    }
    attempts++;
  }
  return bagels;
}

const bagels: Bagel[] = generateBagels();

document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === "w") {
    player.setCurrentFrameY(1);
    player.setCurrentFrameX(player.getCurrentFrameX() + 1);
    player.setVelY(-PLAYER_SPEED);
  }
  else if (e.key === "s") {
    player.setCurrentFrameY(0);
    player.setCurrentFrameX(player.getCurrentFrameX() + 1);
    player.setVelY(PLAYER_SPEED);
  }
  else if (e.key === "a") {
    player.setCurrentFrameY(2);
    player.setCurrentFrameX(player.getCurrentFrameX() + 1);
    player.setVelX(-PLAYER_SPEED);
  }
  else if (e.key === "d") {
    player.setCurrentFrameY(3);
    player.setCurrentFrameX(player.getCurrentFrameX() + 1);
    player.setVelX(PLAYER_SPEED);
  }
});

document.addEventListener("keyup", (e: KeyboardEvent) => {
  if (e.key === "w") {
    player.setCurrentFrameX(0);
    player.setVelY(0);
  }
  else if (e.key === "s") {
    player.setCurrentFrameX(0);
    player.setVelY(0);
  }
  else if (e.key === "a") {
    player.setCurrentFrameX(0);
    player.setVelX(0);
  }
  else if (e.key === "d") {
    player.setCurrentFrameX(3);
    player.setVelX(0);
  }
})

const gameObjects: Array<GameObject | undefined> = [player, salmon, creamCheese].concat(bagels);

const loop = () => {
  if (!ctx) throw new Error("No context found");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  level.draw(ctx);

  /*const prevLives = player.getLives();

  for (let i = 0; i < gameObjects.length; i++) {
    for (let j = 0; j < gameObjects.length; j++) {
      if (gameObjects[i] == null || gameObjects[j] == null || gameObjects[i] === gameObjects[j]) continue;

      // Player collision logic
      if (gameObjects[i]?.getTag() === PLAYER_TAG) {
        const p = gameObjects[i] as Player
        if (!p.isCollidingWith(gameObjects[j]!)) {
          if (gameObjects[j]?.getTag() === BAGEL_TAG) {
            p.setLives(p.getLives() - 1);
            p.setX(50);
            p.setY(50);
          }
          if (gameObjects[j]?.getTag() === SALMON_TAG) {
            gameObjects[j] = undefined;
            PLAYER_SPEED = 10;
            setTimeout(() => PLAYER_SPEED = 5, 5000)
          }
          if (gameObjects[j]?.getTag() === CREAM_CHEESE_TAG) {
            gameObjects[j] = undefined;
            PLAYER_SPEED = 2;
            setTimeout(() => PLAYER_SPEED = 5, 5000)
          }
        }
      }

      if (gameObjects[i]?.getTag() === BAGEL_TAG) {
        const b = gameObjects[i] as Bagel;
        if (prevLives != player.getLives()) b.setGameObjectToFollow(undefined);
        if (!b.getGameObjectToFollow() && !b.isInRadius(gameObjects[j]!) && b.isFollowableItem(gameObjects[j]?.getTag()!)) {
          b.setState("following");
          b.setGameObjectToFollow(gameObjects[j]!);
        }
      }
    }

    gameObjects[i]?.update();
    gameObjects[i]?.draw(ctx);
  }*/

  requestAnimationFrame(loop);
}


loop();
