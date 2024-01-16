import Game from "./game";
import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");

if (!canvas) throw new Error("No canvas element found");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

if (!ctx) throw new Error("No context found");

const game = new Game(canvas);

let startTime = 0;

const loop = (now: number = 0) => {
  if (!ctx) throw new Error("No context found");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let deltaTime = now - startTime;
  startTime = now;

  game.update(deltaTime);
  game.draw(ctx);

  requestAnimationFrame(loop);
};

loop();
