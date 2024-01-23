import { GameTag, MAP_CONSTANTS, TILE_SIZE, TileMap } from "@/constants";
import OfficeWorkerSprite from "@/assets/images/office-worker-Sheet.png";
import Vector2 from "../math/vector2";
import GameObject from "./game-object";
import { clamp, getRandomArbitrary } from "@/helpers";
import Camera from "./camera";

const officeWorkerSpriteSheet = new Image();
officeWorkerSpriteSheet.src = OfficeWorkerSprite;

const TARGET_RANGE = 2;

const pathfinder = new Worker("pathfinder.ts", { type: "module" });

class OfficeWorker extends GameObject {
  private nextPosition: Vector2;
  private velocity: Vector2;
  private worldMap: number[][];
  private frameX: number;
  private frameY: number;
  private frameCounter: number;
  private pathToFollow: number[][];

  constructor(position: Vector2, width: number, height: number, map: number[][]) {
    super(GameTag.OFFICE_WORKER, position, width, height);
    this.velocity = Vector2.Zero();
    this.worldMap = map;
    this.frameX = 0;
    this.frameY = 0;
    this.frameCounter = 0;
    this.pathToFollow = [];
    this.nextPosition = this.getNextPosition();
    //console.log(this.position, this.nextPosition);
    pathfinder.postMessage({ position: this.position, nextPosition: this.nextPosition, map: this.worldMap });

    pathfinder.onmessage = function (message) {
      console.log(message.data);
    };
    //console.log(this.getWalkingPath());
  }

  public update(deltaTime: number): void {
    //if (!this.nearTarget()) this.nextPosition = this.getNextPosition();
    //if (this.nextPosition === Vector2.Zero()) return;
    // Determine if we should change direction
    if (
      this.velocity.x < 0 &&
      (MAP_CONSTANTS.includes(
        this.worldMap[Math.floor(this.getBottom() / TILE_SIZE)][
          Math.floor((this.position.x + this.velocity.x) / TILE_SIZE)
        ]
      ) ||
        MAP_CONSTANTS.includes(
          this.worldMap[Math.floor(this.position.y / TILE_SIZE)][
            Math.floor((this.position.x + this.velocity.x) / TILE_SIZE)
          ]
        ))
    ) {
      this.velocity.x = 0;
    }
    if (
      this.velocity.x > 0 &&
      (MAP_CONSTANTS.includes(
        this.worldMap[Math.floor(this.position.y / TILE_SIZE)][
          Math.ceil((this.position.x + this.velocity.x) / TILE_SIZE)
        ]
      ) ||
        MAP_CONSTANTS.includes(
          this.worldMap[Math.floor(this.getBottom() / TILE_SIZE)][
            Math.ceil((this.position.x + this.velocity.x) / TILE_SIZE)
          ]
        ))
    ) {
      this.velocity.x = 0;
    }
    if (
      this.velocity.y < 0 &&
      (MAP_CONSTANTS.includes(
        this.worldMap[Math.floor((this.position.y + this.velocity.y) / TILE_SIZE)][
          Math.floor(this.position.x / TILE_SIZE)
        ]
      ) ||
        MAP_CONSTANTS.includes(
          this.worldMap[Math.floor((this.position.y + this.velocity.y) / TILE_SIZE)][
            Math.floor(this.getRight() / TILE_SIZE)
          ]
        ))
    ) {
      this.velocity.y = 0;
    }
    if (
      this.velocity.y > 0 &&
      (MAP_CONSTANTS.includes(
        this.worldMap[Math.ceil((this.position.y + this.velocity.y) / TILE_SIZE)][
          Math.floor(this.position.x / TILE_SIZE)
        ]
      ) ||
        MAP_CONSTANTS.includes(
          this.worldMap[Math.ceil((this.position.y + this.velocity.y) / TILE_SIZE)][
            Math.floor(this.getRight() / TILE_SIZE)
          ]
        ))
    ) {
      this.velocity.y = 0;
    }

    this.velocity.x = clamp(this.velocity.x * deltaTime, -2, 2);
    this.velocity.y = clamp(this.velocity.y * deltaTime, -2, 2);

    this.position.add(this.velocity);
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (this.velocity.y > 0) this.frameY = 1;
    else if (this.velocity.y < 0) this.frameY = 2;
    else if (this.velocity.x > 0) this.frameY = 4;
    else if (this.velocity.x < 0) this.frameY = 3;
    else this.frameY = 0;

    if (this.frameCounter % 7 === 0) {
      if (this.frameX + 1 > 3) this.frameX = 0;
      else this.frameX++;
    }
    ctx.drawImage(
      officeWorkerSpriteSheet,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.position.x - camera.getPosition().x,
      this.position.y - camera.getPosition().y,
      this.width,
      this.height
    );
    this.frameCounter += 1;
  }

  private getNextPosition(): Vector2 {
    let newPosition;
    let attempts = 0;
    while (!newPosition || attempts < 10) {
      const xVal = getRandomArbitrary(0, this.worldMap[0].length - 1);
      const yVal = getRandomArbitrary(0, this.worldMap.length - 1);
      if (this.worldMap[yVal][xVal] === TileMap.FLOOR) newPosition = new Vector2(xVal, yVal);
      attempts += 1;
    }
    return newPosition || Vector2.Zero();
  }

  private nearTarget(): boolean {
    return (
      this.getBottom() + TARGET_RANGE <= this.nextPosition.y ||
      this.position.y - TARGET_RANGE >= this.nextPosition.y + TILE_SIZE ||
      this.getRight() + TARGET_RANGE <= this.nextPosition.x ||
      this.position.x - TARGET_RANGE >= this.nextPosition.x + TILE_SIZE
    );
  }
}

export default OfficeWorker;
