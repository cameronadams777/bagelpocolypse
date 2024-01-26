import { Scenes, TILE_SIZE } from "./constants";
import Game from "./game";
import HeartImage from "@/assets/images/heart.png";
import ToasterGunImage from "@/assets/images/toaster-gun-Sheet.png";
import SalmonImage from "@/assets/images/salmon.png";
import CreamCheeseImage from "@/assets/images/cream-cheese.png";
import SpreadingToolImage from "@/assets/images/spreading-tool-Sheet.png";
import BagelImage from "@/assets/images/basic-bagel-Sheet.png";
import OfficeWorkerImage from "@/assets/images/office-worker-Sheet.png";
import StairsImage from "@/assets/images/stairs.png";
import OpeningScene from "./game/cutscenes/opening-scene";
import Vector2 from "./game/math/vector2";
import Button from "./game/ui/button";
import Menu from "./game/ui/menu";
import "./style.css";

const heartSprite = new Image();
heartSprite.src = HeartImage;

const toasterGunSprite = new Image();
toasterGunSprite.src = ToasterGunImage;

const salmonSprite = new Image();
salmonSprite.src = SalmonImage;

const creamCheeseSprite = new Image();
creamCheeseSprite.src = CreamCheeseImage;

const spreadingToolSprite = new Image();
spreadingToolSprite.src = SpreadingToolImage;

const bagelSprite = new Image();
bagelSprite.src = BagelImage;

const officeWorkerSprite = new Image();
officeWorkerSprite.src = OfficeWorkerImage;

const stairsSprite = new Image();
stairsSprite.src = StairsImage;

const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");

if (!canvas) throw new Error("No canvas element found");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

if (!ctx) throw new Error("No context found");

let startTime = 0;

let currentScene = Scenes.MAIN_MENU;

const game = new Game(canvas);

const openingScene = new OpeningScene(canvas, () => {
  currentScene = Scenes.GAME;
});

const mainMenu = new Menu(canvas)
  .setBackgroundColor("#000")
  .setTitle("Bagelpocolypse")
  .addButton(
    new Button(new Vector2(canvas.width / 2 - 100, canvas.height / 2 - 25), 300, 50, "Play", "red", "#fff", () => {
      mainMenu.destroy();
      currentScene = Scenes.OPENING_SCENE;
    })
  )
  .addButton(
    new Button(new Vector2(canvas.width / 2 - 100, canvas.height / 2 + 50), 300, 50, "Tutorial", "red", "#fff", () => {
      mainMenu.destroy();
      tutorialMenu.create();
      currentScene = Scenes.TUTORIAL_MENU;
    })
  )
  .create();

let toasterGunFrameTimer = 0;
let toasterGunFrameX = 0;

let salmonFrameTimer = 0;
let salmonFrameX = 0;

let spreadingToolFrameTimer = 0;
let spreadingToolFrameX = 0;

let officeWorkerFrameTimer = 0;
let officeWorkerFrameX = 0;

let bagelFrameTimer = 0;
let bagelFrameX = 0;

const tutorialMenu = new Menu(canvas).setBackgroundColor("#000").addButton(
  new Button(new Vector2(canvas.width / 2 - 100, canvas.height * 0.85), 300, 50, "Close", "red", "#fff", () => {
    tutorialMenu.destroy();
    mainMenu.create();
    currentScene = Scenes.MAIN_MENU;
  })
);

const loop = (now: number = 0) => {
  if (!ctx) throw new Error("No context found");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let deltaTime = now - startTime;
  startTime = now;

  switch (currentScene) {
    case Scenes.MAIN_MENU:
      mainMenu.draw(ctx);
      break;
    case Scenes.TUTORIAL_MENU:
      tutorialMenu.draw(ctx, () => {
        ctx.drawImage(stairsSprite, canvas.width / 2 - 350, canvas.height / 4 - 125, TILE_SIZE, TILE_SIZE);
        ctx.font = "20px Verdana";
        ctx.fillStyle = "white";
        ctx.fillText(
          "Ascend! You need to reach the roof to evacuate. Look for stairs to attempt your escape.",
          canvas.width / 2 - 300,
          canvas.height / 4 - 105
        );

        ctx.drawImage(heartSprite, canvas.width / 2 - 350, canvas.height / 4 - 50, TILE_SIZE, TILE_SIZE);
        ctx.fillText(
          "A heart represent the lives you have left. Try not to lose them!",
          canvas.width / 2 - 300,
          canvas.height / 4 - 25
        );

        toasterGunFrameTimer += 1;
        if (toasterGunFrameTimer % 5 === 0) {
          toasterGunFrameX += 1;
          if (toasterGunFrameX > 2) toasterGunFrameX = 0;
        }

        ctx.drawImage(
          toasterGunSprite,
          toasterGunFrameX * TILE_SIZE,
          0,
          TILE_SIZE,
          TILE_SIZE,
          canvas.width / 2 - 350,
          canvas.height / 4 + 25,
          TILE_SIZE,
          TILE_SIZE
        );
        ctx.fillText(
          "This is your toaster gun! You automatically have it but if you see one,",
          canvas.width / 2 - 300,
          canvas.height / 4 + 40
        );
        ctx.fillText("pick it up to increase your charge!", canvas.width / 2 - 300, canvas.height / 4 + 65);

        salmonFrameTimer += 1;
        if (salmonFrameTimer % 5 === 0) {
          salmonFrameX += 1;
          if (salmonFrameX > 3) salmonFrameX = 0;
        }

        ctx.drawImage(
          salmonSprite,
          salmonFrameX * TILE_SIZE,
          0,
          TILE_SIZE,
          TILE_SIZE,
          canvas.width / 2 - 350,
          canvas.height / 4 + 105,
          TILE_SIZE,
          TILE_SIZE
        );
        ctx.fillText(
          "Lox! The amazing taste will give you a jolt of speed!",
          canvas.width / 2 - 300,
          canvas.height / 4 + 125
        );

        spreadingToolFrameTimer += 1;
        if (spreadingToolFrameTimer % 5 === 0) {
          spreadingToolFrameX += 1;
          if (spreadingToolFrameX > 2) spreadingToolFrameX = 0;
        }

        ctx.drawImage(
          spreadingToolSprite,
          spreadingToolFrameX * TILE_SIZE,
          0,
          TILE_SIZE,
          TILE_SIZE,
          canvas.width / 2 - 350,
          canvas.height / 4 + 185,
          TILE_SIZE,
          TILE_SIZE
        );
        ctx.fillText(
          "Pick up a spreading tool along the way! They'll prevent you from losing a life.",
          canvas.width / 2 - 300,
          canvas.height / 4 + 195
        );
        ctx.fillText("But once you use it... you lose it!", canvas.width / 2 - 300, canvas.height / 4 + 220);

        bagelFrameTimer += 1;
        if (bagelFrameTimer % 5 === 0) {
          bagelFrameX += 1;
          if (bagelFrameX > 2) bagelFrameX = 0;
        }

        ctx.drawImage(
          bagelSprite,
          bagelFrameX * TILE_SIZE,
          0,
          TILE_SIZE,
          TILE_SIZE,
          canvas.width / 2 - 350,
          canvas.height / 4 + 287.5,
          TILE_SIZE,
          TILE_SIZE
        );
        ctx.fillText(
          "Beware of the once Lame Company, Inc. employees now turned Bagels!",
          canvas.width / 2 - 300,
          canvas.height / 4 + 295
        );
        ctx.fillText("If they see you, they're coming for you!", canvas.width / 2 - 300, canvas.height / 4 + 320);

        officeWorkerFrameTimer += 1;
        if (officeWorkerFrameTimer % 5 === 0) {
          officeWorkerFrameX += 1;
          if (officeWorkerFrameX > 2) officeWorkerFrameX = 0;
        }

        ctx.drawImage(
          officeWorkerSprite,
          officeWorkerFrameX * TILE_SIZE,
          0,
          TILE_SIZE,
          TILE_SIZE,
          canvas.width / 2 - 350,
          canvas.height / 4 + 385,
          TILE_SIZE,
          TILE_SIZE
        );
        ctx.fillText(
          "You coworkers are trying to find a way out too! If bagels see them and",
          canvas.width / 2 - 300,
          canvas.height / 4 + 395
        );
        ctx.fillText(
          "turn them though... You'll have more problems than you started with...",
          canvas.width / 2 - 300,
          canvas.height / 4 + 420
        );

        ctx.drawImage(creamCheeseSprite, canvas.width / 2 - 350, canvas.height / 4 + 465, TILE_SIZE, TILE_SIZE);
        ctx.fillText(
          "All the creamy cream cheese goodness... Don't let it slow you down!",
          canvas.width / 2 - 300,
          canvas.height / 4 + 490
        );
      });
      break;
    case Scenes.GAME:
      game.update(deltaTime);
      game.draw(ctx);
      break;
    case Scenes.OPENING_SCENE:
      openingScene.draw(ctx);
      break;
    case Scenes.CLOSING_SCENE:
      //endScene.draw(ctx);
      break;
  }

  requestAnimationFrame(loop);
};

loop();
