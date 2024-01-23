import GameObject from "../game-object";
import Vector2 from "../../math/vector2";
import Camera from "../camera";
import { BAGEL_SPEED, GameTag, MAP_CONSTANTS, TILE_SIZE } from "../../../constants";
import { clamp } from "../../../helpers";
import BasicBagelSpriteSheet from "../../../assets/images/basic-bagel-Sheet.png";

const DETECTION_RADIUS_OFFSET = 150;

const spriteSheet = new Image();
spriteSheet.src = BasicBagelSpriteSheet;

class Bagel extends GameObject {
  private velocity: Vector2;
  private follow: GameObject | undefined;
  private worldMap: number[][];
  private followTimer: number;
  private frameX: number;
  private frameY: number;
  private frameCounter: number;

  constructor(position: Vector2, width: number, height: number, map: number[][]) {
    super(GameTag.BAGEL_TAG, position, width, height);
    this.worldMap = map;
    this.velocity = Vector2.Zero();
    this.follow = undefined;
    this.followTimer = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frameCounter = 0;
  }

  public update(deltaTime: number): void {
    this.velocity = Vector2.Zero();

    if (this.follow == null) return;

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
}

export default Bagel;
