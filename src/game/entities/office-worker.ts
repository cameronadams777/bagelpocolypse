import { BAGEL_SPEED, GameTag, TILE_SIZE, TileMap } from "@/constants";
import OfficeWorkerSprite from "@/assets/images/office-worker-Sheet.png";
import Vector2 from "../math/vector2";
import GameObject from "./game-object";
import { clamp, getRandomArbitrary } from "@/helpers";
import Camera from "./camera";
import { Grid, AStarFinder, DiagonalMovement } from "pathfinding";

const officeWorkerSpriteSheet = new Image();
officeWorkerSpriteSheet.src = OfficeWorkerSprite;

//const pathfinder = new Worker("pathfinder.ts", { type: "module" });
const pathfinder = new AStarFinder({
  diagonalMovement: DiagonalMovement.Never
});

class OfficeWorker extends GameObject {
  private nextPosition: Vector2;
  private velocity: Vector2;
  private worldMap: number[][];
  private frameX: number;
  private frameY: number;
  private frameCounter: number;
  private pathToFollow: number[][];
  private resetTimer: number;
  private grid: Grid;

  constructor(position: Vector2, width: number, height: number, map: number[][]) {
    super(GameTag.OFFICE_WORKER, position, width, height);
    this.velocity = Vector2.Zero();
    this.worldMap = map;
    this.frameX = 0;
    this.frameY = 0;
    this.frameCounter = 0;
    this.resetTimer = 0;
    this.pathToFollow = [];
    this.nextPosition = this.getNextPosition();

    const startPosition = new Vector2(this.position.x / TILE_SIZE, this.position.y / TILE_SIZE);
    this.grid = new Grid(map);
    for (let j = 0; j < map.length; j++) {
      for (let i = 0; i < map[j].length; i++) {
        if (map[j][i] !== TileMap.FLOOR) this.grid.setWalkableAt(i, j, false);
        else this.grid.setWalkableAt(i, j, true);
      }
    }
    this.pathToFollow = pathfinder.findPath(
      startPosition.x,
      startPosition.y,
      this.nextPosition.x,
      this.nextPosition.y,
      this.grid.clone()
    );
  }

  public update(deltaTime: number): void {
    this.followPath();
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
      if (this.frameX >= 3) this.frameX = 0;
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

  private followPath(): void {
    const currentPathPosition = this.pathToFollow[0];
    if (!currentPathPosition) return;
    const mapBasedPosition = new Vector2(
      Math.round(this.position.x / TILE_SIZE),
      Math.round(this.position.y / TILE_SIZE)
    );
    if (
      Math.abs(mapBasedPosition.x - currentPathPosition[0]) <= 0 &&
      Math.abs(mapBasedPosition.y - currentPathPosition[1]) <= 0
    ) {
      this.pathToFollow = this.pathToFollow.slice(1, this.pathToFollow.length - 1);
    } else {
      if (mapBasedPosition.x < currentPathPosition[0]) {
        this.velocity.x = BAGEL_SPEED;
        this.velocity.y = 0;
      } else if (mapBasedPosition.x > currentPathPosition[0]) {
        this.velocity.x = -BAGEL_SPEED;
        this.velocity.y = 0;
      } else if (mapBasedPosition.y < currentPathPosition[1]) {
        this.velocity.y = BAGEL_SPEED;
        this.velocity.x = 0;
      } else if (mapBasedPosition.y > currentPathPosition[1]) {
        this.velocity.y = -BAGEL_SPEED;
        this.velocity.x = 0;
      } else {
        this.velocity = Vector2.Zero();
      }
    }

    if (!this.pathToFollow.length) {
      if (this.resetTimer >= 250) {
        this.nextPosition = this.getNextPosition();
        this.pathToFollow = pathfinder.findPath(
          mapBasedPosition.x,
          mapBasedPosition.y,
          this.nextPosition.x,
          this.nextPosition.y,
          this.grid.clone()
        );
        this.resetTimer = 0;
        return;
      }
      this.resetTimer += 1;
    }
  }
}

export default OfficeWorker;
