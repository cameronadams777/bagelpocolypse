import Bagel from "./game/bagel";
import CreamCheese from "./game/cream-cheese";
import GameObject from "./game/game-object";
import Player from "./game/player";
import Salmon from "./game/salmon";
import "./style.css";
const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");

if (!canvas) throw new Error("No canvas element found")

canvas.width = 1280;
canvas.height = 720;

const ctx = canvas.getContext("2d");

const PLAYER_TAG = "player";
const BAGEL_TAG = "bagel";
const SALMON_TAG = "salmon";
const CREAM_CHEESE_TAG = "cream_cheese";

let PLAYER_SPEED: number = 5;

const player = new Player(PLAYER_TAG, 50, 50, 50, 50);
const bagel = new Bagel(BAGEL_TAG, 150, 150, 50, 50);
const salmon = new Salmon(SALMON_TAG, 500, 500, 50, 50);
const creamCheese = new CreamCheese(CREAM_CHEESE_TAG, 250, 250, 50, 50);

document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === "w") player.setVelY(-PLAYER_SPEED);
  else if (e.key === "s") player.setVelY(PLAYER_SPEED);
  else if (e.key === "a") player.setVelX(-PLAYER_SPEED);
  else if (e.key === "d") player.setVelX(PLAYER_SPEED);
});

document.addEventListener("keyup", (e: KeyboardEvent) => {
  if (e.key === "w") player.setVelY(0);
  else if (e.key === "s") player.setVelY(0);
  else if (e.key === "a") player.setVelX(0);
  else if (e.key === "d") player.setVelX(0);
})

const gameObjects: Array<GameObject | undefined> = [player, bagel, salmon, creamCheese];

const loop = () => {
  if (!ctx) throw new Error("No context found");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.update();

  for (let i = 0; i < gameObjects.length; i++) {
    if (!gameObjects[i]) continue;
    if (!player.isCollidingWith(gameObjects[i]!)) {
      if (gameObjects[i]?.getTag() === BAGEL_TAG) {
        player.setLives(player.getLives() - 1);
        player.setX(50);
        player.setY(50);
      }
      if (gameObjects[i]?.getTag() === SALMON_TAG) {
        gameObjects[i] = undefined;
        PLAYER_SPEED = 10;
        setTimeout(() => PLAYER_SPEED = 5, 5000)
      }
      if (gameObjects[i]?.getTag() === CREAM_CHEESE_TAG) {
        gameObjects[i] = undefined;
        PLAYER_SPEED = 2;
        setTimeout(() => PLAYER_SPEED = 5, 5000)
      }
    }

    gameObjects[i]?.draw(ctx);
  }



  requestAnimationFrame(loop);
}

loop();
