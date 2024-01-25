import { Scenes } from "./constants";
import Game from "./game";
import OpeningScene from "./game/cutscenes/opening-scene";
import Vector2 from "./game/math/vector2";
import Button from "./game/ui/button";
import Menu from "./game/ui/menu";
import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");

if (!canvas) throw new Error("No canvas element found");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

if (!ctx) throw new Error("No context found");

const game = new Game(canvas);

let startTime = 0;

let currentScene = Scenes.MAIN_MENU;

const openingScene = new OpeningScene(canvas, () => {
  currentScene = Scenes.GAME;
});

const mainMenu = new Menu(canvas)
  .setBackgroundColor("#000")
  .addButton(
    new Button(
      new Vector2(canvas.width / 2 - 100, canvas.height / 2 - 25),
      200,
      50,
      "Play Demo",
      "red",
      "#fff",
      () => (currentScene = Scenes.OPENING_SCENE)
    )
  )
  .addButton(
    new Button(new Vector2(canvas.width / 2 - 100, canvas.height / 2 + 50), 200, 50, "Settings", "red", "#fff", () =>
      alert("Need to build settings menu")
    )
  )
  .create();

const loop = (now: number = 0) => {
  if (!ctx) throw new Error("No context found");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let deltaTime = now - startTime;
  startTime = now;

  switch (currentScene) {
    case Scenes.MAIN_MENU:
      mainMenu.draw(ctx);
      break;
    case Scenes.GAME:
      game.update(deltaTime);
      game.draw(ctx);
      break;
    case Scenes.OPENING_SCENE:
      openingScene.draw(ctx);
      break;
  }

  requestAnimationFrame(loop);
};

loop();
