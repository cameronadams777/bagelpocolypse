import { GameTag, MAP_CONSTANTS, TILE_SIZE } from "@/constants";
import OfficeWorkerSprite from "@/assets/images/office-worker-Sheet.png";
import Vector2 from "../math/vector2";
import GameObject from "./game-object";
import { clamp, getRandomArbitrary } from "@/helpers";
import Camera from "./camera";

const officeWorkerSpriteSheet = new Image();
officeWorkerSpriteSheet.src = OfficeWorkerSprite;

class OfficeWorker extends GameObject {
  private directionChangeTimer: number;
  private velocity: Vector2;
  private worldMap: number[][];
  private frameX: number;
  private frameY: number;
  private frameCounter: number;

  constructor(position: Vector2, width: number, height: number, map: number[][]) {
    super(GameTag.OFFICE_WORKER, position, width, height);
    this.velocity = Vector2.Zero();
    this.directionChangeTimer = 0;
    this.worldMap = map;
    this.frameX = 0;
    this.frameY = 0;
    this.frameCounter = 0;
  }

  public update(deltaTime: number): void {
    // Determine if we should change direction
    if (this.directionChangeTimer === 0) {
      this.velocity = this.generateNewRandomVel();
    }

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

    this.directionChangeTimer += 1;
    if (this.directionChangeTimer >= 100) {
      this.directionChangeTimer = 0;
    }
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (this.velocity.y > 0) this.frameY = 1;
    else if (this.velocity.y < 0) this.frameY = 2;
    else if (this.velocity.x > 0) this.frameY = 4;
    else if (this.velocity.x < 0) this.frameY = 3;
    else this.frameY = 0;

    if (this.frameCounter % 7 === 0) {
      if (this.frameX + 1 > 2) this.frameX = 0;
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

  private generateNewRandomVel(): Vector2 {
    let newVelX = getRandomArbitrary(0, 3);
    let newVelY = getRandomArbitrary(0, 3);
    const randX = getRandomArbitrary(0, 10);
    const randY = getRandomArbitrary(0, 10);
    if (randX > 5) newVelX = -newVelX;
    if (randY > 5) newVelY = -newVelY;
    return new Vector2(newVelX, newVelY);
  }
}

export default OfficeWorker;
