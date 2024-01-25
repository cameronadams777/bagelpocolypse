import { Grid, AStarFinder, DiagonalMovement } from "pathfinding";
import GameObject from "../game-object";
import Camera from "../camera";
import Vector2 from "@/game/math/vector2";
import { BAGEL_SPEED, GameTag, MAP_CONSTANTS, TILE_SIZE, TileMap } from "@/constants";
import { clamp, getRandomArbitrary } from "@/helpers";
import BasicBagelSpriteSheet from "@/assets/images/basic-bagel-Sheet.png";

const DETECTION_RADIUS_OFFSET = 150;

const spriteSheet = new Image();
spriteSheet.src = BasicBagelSpriteSheet;

const pathfinder = new AStarFinder({
  diagonalMovement: DiagonalMovement.Never
});

class Bagel extends GameObject {
  private velocity: Vector2;
  private follow: GameObject | undefined;
  private worldMap: number[][];
  private followTimer: number;
  private frameX: number;
  private frameY: number;
  private frameCounter: number;
  private pathToFollow: number[][];
  private nextPosition: Vector2;
  private grid: Grid;

  constructor(position: Vector2, width: number, height: number, map: number[][]) {
    super(GameTag.BAGEL_TAG, position, width, height);
    this.worldMap = map;
    this.velocity = Vector2.Zero();
    this.follow = undefined;
    this.followTimer = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frameCounter = 0;

    this.pathToFollow = [];
    this.nextPosition = this.getNextPosition();

    const startPosition = new Vector2(Math.round(this.position.x / TILE_SIZE), Math.round(this.position.y / TILE_SIZE));
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
    if (this.follow != null) {
      this.velocity = Vector2.Zero();
      if (
        this.follow.getPosition().x < this.position.x &&
        !(
          MAP_CONSTANTS.includes(
            this.worldMap[Math.floor(this.position.y / TILE_SIZE)][
              Math.floor((this.position.x + this.velocity.x) / TILE_SIZE)
            ]
          ) ||
          MAP_CONSTANTS.includes(
            this.worldMap[Math.floor(this.getBottom() / TILE_SIZE)][
              Math.floor((this.position.x + this.velocity.x) / TILE_SIZE)
            ]
          )
        )
      )
        this.velocity.x = -BAGEL_SPEED;
      if (
        this.follow.getPosition().x > this.getRight() &&
        !(
          MAP_CONSTANTS.includes(
            this.worldMap[Math.floor(this.position.y / TILE_SIZE)][
              Math.ceil((this.position.x + this.velocity.x) / TILE_SIZE)
            ]
          ) ||
          MAP_CONSTANTS.includes(
            this.worldMap[Math.floor(this.getBottom() / TILE_SIZE)][
              Math.ceil((this.position.x + this.velocity.x) / TILE_SIZE)
            ]
          )
        )
      )
        this.velocity.x = BAGEL_SPEED;
      if (
        this.follow.getPosition().y < this.position.y &&
        !(
          MAP_CONSTANTS.includes(
            this.worldMap[Math.ceil((this.position.y + this.velocity.y) / TILE_SIZE)][
              Math.floor(this.position.x / TILE_SIZE)
            ]
          ) ||
          MAP_CONSTANTS.includes(
            this.worldMap[Math.ceil((this.position.y + this.velocity.y) / TILE_SIZE)][
              Math.floor(this.getRight() / TILE_SIZE)
            ]
          )
        )
      )
        this.velocity.y = -BAGEL_SPEED;
      if (
        this.follow.getPosition().y > this.getBottom() &&
        !(
          MAP_CONSTANTS.includes(
            this.worldMap[Math.ceil((this.position.y + this.velocity.y) / TILE_SIZE)][
              Math.floor(this.position.x / TILE_SIZE)
            ]
          ) ||
          MAP_CONSTANTS.includes(
            this.worldMap[Math.ceil((this.position.y + this.velocity.y) / TILE_SIZE)][
              Math.floor(this.getRight() / TILE_SIZE)
            ]
          )
        )
      )
        this.velocity.y = BAGEL_SPEED;

      this.followTimer += 1;
      if (this.followTimer >= 500 && this.isInRadius(this.follow)) {
        this.follow = undefined;
        this.followTimer = 0;
      }
    } else {
      this.followPath();
    }

    this.velocity.x = clamp(this.velocity.x * deltaTime, -BAGEL_SPEED, BAGEL_SPEED);
    this.velocity.y = clamp(this.velocity.y * deltaTime, -BAGEL_SPEED, BAGEL_SPEED);

    this.position.add(this.velocity);
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (this.velocity.y > 0) this.frameY = 3;
    else if (this.velocity.y < 0) this.frameY = 4;
    else if (this.velocity.x > 0) this.frameY = 1;
    else if (this.velocity.x < 0) this.frameY = 2;
    else this.frameY = 0;

    if (this.frameCounter % 7 === 0) {
      if (this.frameX + 1 > 2) this.frameX = 0;
      else this.frameX++;
    }
    ctx.drawImage(
      spriteSheet,
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

  public getVelocity(): Vector2 {
    return this.velocity;
  }

  public setVelocity(velocity: Vector2): void {
    this.velocity = velocity;
  }

  public getGameObjectToFollow(): GameObject | undefined {
    return this.follow;
  }

  public setGameObjectToFollow(gameObject: GameObject | undefined): void {
    this.follow = gameObject;
  }

  public isInDynamicRadius(gameObject: GameObject, radius: number) {
    return (
      this.getBottom() + radius <= gameObject.getPosition().y ||
      this.position.y - radius >= gameObject.getBottom() ||
      this.getRight() + radius <= gameObject.getPosition().x ||
      this.position.x - radius >= gameObject.getRight()
    );
  }

  public isInRadius(gameObject: GameObject): boolean {
    return (
      this.getBottom() + DETECTION_RADIUS_OFFSET <= gameObject.getPosition().y ||
      this.position.y - DETECTION_RADIUS_OFFSET >= gameObject.getBottom() ||
      this.getRight() + DETECTION_RADIUS_OFFSET <= gameObject.getPosition().x ||
      this.position.x - DETECTION_RADIUS_OFFSET >= gameObject.getRight()
    );
  }

  public isFollowableItem(tag: GameTag): boolean {
    return [GameTag.PLAYER_TAG, GameTag.OFFICE_WORKER].includes(tag);
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
      this.nextPosition = this.getNextPosition();
      this.pathToFollow = pathfinder.findPath(
        mapBasedPosition.x,
        mapBasedPosition.y,
        this.nextPosition.x,
        this.nextPosition.y,
        this.grid.clone()
      );
    }
  }
}

export default Bagel;
