import Level from "./game/level";
import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");

if (!canvas) throw new Error("No canvas element found");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

if (!ctx) throw new Error("No context found");

const level = new Level(canvas);

const loop = () => {
  if (!ctx) throw new Error("No context found");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  level.update();

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
};

loop();
