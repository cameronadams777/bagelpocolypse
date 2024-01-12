import Bagel from "./game/bagel";
import Player from "./game/player";
import Salmon from "./game/salmon";
import "./style.css";
const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");

if (!canvas) throw new Error("No canvas element found")

canvas.width = 1280;
canvas.height = 720;

const ctx = canvas.getContext("2d");

const PLAYER_SPEED: number = 3;

const player = new Player(50, 50, 50, 50);
const bagel = new Bagel(150, 150, 50, 50);
const salmon = new Salmon(500, 500, 50, 50);

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

const loop = () => {
  if (!ctx) throw new Error("No context found");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (player.isCollidingWith(bagel)) {
    player.setLives(player.getLives() - 1);
    player.setX(50);
    player.setY(50);
  }

  player.update();

  player.draw(ctx);
  bagel.draw(ctx);
  salmon.draw(ctx);

  requestAnimationFrame(loop);
}

loop();
