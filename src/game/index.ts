import { getRandomArbitrary } from "../helpers";
import { Room } from "./entities/room";
import {
  GameTags,
  MAX_SPREADING_TOOL_COUNT,
  MAX_TOASTER_GUN_SHOT_COUNT,
  TILE_SIZE
} from "../constants";
import Player from "./entities/player";
import Bagel from "./entities/enemies/bagel";
import GameObject from "./entities/game-object";
import Vector2 from "./math/vector2";
import Camera from "./entities/camera";
import WizardBoss from "./entities/enemies/wizard-boss";

const entityConstants = [2, 3, 4, 6, 7, 20];

const generateSpawnCoordinates = (map: number[][], rooms: Room[]): { position: Vector2; room: Room } => {
  const randRoom = rooms[getRandomArbitrary(0, rooms.length - 1)];
  let randPosition: Vector2 | undefined;
  while (randPosition == null || entityConstants.includes(map[randPosition.y][randPosition.x])) {
    randPosition = new Vector2(
      getRandomArbitrary(randRoom.getPosition().x + 2, randRoom.getRight() - 2),
      getRandomArbitrary(randRoom.getPosition().y + 2, randRoom.getBottom() - 2)
    );
  }
  return {
    position: randPosition,
    room: randRoom
  };
};

class Game {
  private canvas: HTMLCanvasElement;
  private camera: Camera;
  private player: Player;
  private boss: WizardBoss;
  private playerInitialSpawn: Vector2;
  private bagels: Bagel[];
  private map: number[][];
  private rooms: Room[];
  private gameObjects: Array<GameObject | undefined>;
  private floorLevel: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.floorLevel = 1;
    this.camera = new Camera(Vector2.Zero(), canvas.width, canvas.height);
    this.map = [];
    this.rooms = [];
    this.bagels = [];
    this.gameObjects = [];
    this.player = new Player(Vector2.Zero(), TILE_SIZE, TILE_SIZE, this.map);
    this.boss = new WizardBoss(Vector2.Zero(), TILE_SIZE, TILE_SIZE, this.player);
    this.playerInitialSpawn = Vector2.Zero();
    this.setupBossLevel();
    // this.setupDungeonLevel();
  }

  public update(deltaTime: number): void {
    for (let i = 0; i < this.gameObjects.length; i++) {
      for (let j = 0; j < this.gameObjects.length; j++) {
        if (this.gameObjects[i] == null || this.gameObjects[j] == null || this.gameObjects[i] === this.gameObjects[j])
          continue;

        // Player collision logic
        if (this.gameObjects[i]?.getTag() === GameTags.PLAYER_TAG) {
          const p = this.gameObjects[i] as Player;
          if (!p.isCollidingWith(this.gameObjects[j]!)) {
            if (this.gameObjects[j]?.getTag() === GameTags.BAGEL_TAG) {
              if (p.getSpreadingToolCount() > 0) {
                this.gameObjects[j] = undefined;
                p.setSpreadingToolCount(p.getSpreadingToolCount() - 1);
              } else {
                p.setLives(p.getLives() - 1);
                p.setPosition(
                  new Vector2(this.playerInitialSpawn.x * TILE_SIZE, this.playerInitialSpawn.y * TILE_SIZE)
                );
              }
            }
            if (this.gameObjects[j]?.getTag() === GameTags.SALMON_TAG) {
              this.gameObjects[j] = undefined;
              this.player.setPlayerSpeedConstant(10);
              setTimeout(() => this.player.setPlayerSpeedConstant(5), 5000);
            }
            if (this.gameObjects[j]?.getTag() === GameTags.CREAM_CHEESE_TAG) {
              this.gameObjects[j] = undefined;
              this.player.setPlayerSpeedConstant(2);
              setTimeout(() => this.player.setPlayerSpeedConstant(5), 5000);
            }
            if (
              this.gameObjects[j]?.getTag() === GameTags.SPREADING_TOOL_TAG &&
              p.getSpreadingToolCount() < MAX_SPREADING_TOOL_COUNT
            ) {
              this.gameObjects[j] = undefined;
              this.player.setSpreadingToolCount(this.player.getSpreadingToolCount() + 1);
            }
            if (this.gameObjects[j]?.getTag() === GameTags.TOASTER_GUN) {
              this.gameObjects[j] = undefined;
              console.log(this.player.getToastGunShotCount(), MAX_TOASTER_GUN_SHOT_COUNT);
              if (this.player.getToastGunShotCount() < MAX_TOASTER_GUN_SHOT_COUNT) {
                this.player.setToasterGunShotCount(this.player.getToastGunShotCount() + 5);
              }
            }
          }
        }

        if (this.gameObjects[i]?.getTag() === GameTags.WIZARD_BOSS) {
          const boss = this.gameObjects[i] as WizardBoss;
          if (boss.getRelocationTimer() >= 250) {
            const { position } = generateSpawnCoordinates(this.map, this.rooms);
            boss.setPosition(new Vector2(position.x * TILE_SIZE, position.y * TILE_SIZE));
            boss.setRelocationTimer(0);
          }
        }
      }

      this.gameObjects[i]?.update(deltaTime);
    }

    if (
      this.map[Math.round(this.player.getPosition().y / TILE_SIZE)][
        Math.round(this.player.getPosition().x / TILE_SIZE)
      ] === 2
    ) {
      this.floorLevel += 1;

      if (this.floorLevel % 15 === 0) this.setupBossLevel();
      else this.setupDungeonLevel();
    }

    if (this.player.getLives() <= 0) {
      this.player.setLives(3);
      this.floorLevel = 1;
      this.setupDungeonLevel();
    }

    for (let i = 0; i < this.player.getAttackObjects().length; i++) {
      const object = this.player.getAttackObjects()[i];
      if (!object) continue;
      if (!object.isCollidingWith(this.boss)) {
        this.player.removeAttackObject(i);
        this.boss.setHealth(this.boss.getHealth() - 5);
      }
      for (let j = 0; j < this.gameObjects.length; j++) {
        if (this.gameObjects[j]?.getTag() !== GameTags.BAGEL_TAG) continue;
        if (!object.isCollidingWith(this.gameObjects[j]!)) {
          this.gameObjects[j] = undefined;
          this.player.removeAttackObject(i);
        }
      }
    }

    for (let i = 0; i < this.boss.getAttackObjects().length; i++) {
      const object = this.boss.getAttackObjects()[i];
      if (!object) continue;

      object?.update(deltaTime);

      if (!object?.isCollidingWith(this.player)) {
        if (this.player.getSpreadingToolCount() > 0) {
          this.boss.removeAttackObject(i);
          this.player.setSpreadingToolCount(this.player.getSpreadingToolCount() - 1);
        } else {
          this.boss.removeAttackObject(i);
          this.player.setLives(this.player.getLives() - 1);
        }
      }

      if (!this.boss.getAttackObjects()[i]?.nearTarget()) {
        this.boss.removeAttackObject(i);
      }
    }

    this.camera.update(this.map);
  }

  public draw(ctx: CanvasRenderingContext2D): void {

    for (let i = 0; i < this.gameObjects.length; i++) {
      if (this.gameObjects[i] != null && !this.camera.isInRadius(this.gameObjects[i]!))
        this.gameObjects[i]?.draw(ctx, this.camera);
    }

    for (let i = 0; i < this.boss.getAttackObjects().length; i++) {
      this.boss.getAttackObjects()[i]?.draw(ctx);
    }

    ctx.font = `40px Verdana`;
    ctx.fillStyle = "red";
    ctx.fillText(`Floor: ${this.floorLevel.toString()}`, 50, 50);
  }
}

export default Game;
