import GameObject from "../game-object";
import Vector2 from "../../math/vector2";
import Camera from "../camera";
import { BAGEL_SPEED, TILE_SIZE } from "../../../constants";

type BagelState = "idle" | "following";

const DETECTION_RADIUS_OFFSET = 150;

class Bagel extends GameObject {
  private velocity: Vector2;
  private follow: GameObject | undefined;
  private worldMap: number[][];
  private followTimer: number;

  constructor(tag: string, position: Vector2, width: number, height: number, map: number[][]) {
    super(tag, position, width, height);
    this.worldMap = map;
    this.velocity = Vector2.Zero();
    this.follow = undefined;
    this.followTimer = 0;
  }

  public update(): void {
    this.velocity = Vector2.Zero();

    if (this.follow == null) return;

    if (
      this.follow.getPosition().x < this.position.x &&
      !(
        this.worldMap[Math.floor(this.position.y / TILE_SIZE)][
          Math.floor((this.position.x + this.velocity.x) / TILE_SIZE)
        ] === 5 ||
        this.worldMap[Math.floor(this.getBottom() / TILE_SIZE)][
          Math.floor((this.position.x + this.velocity.x) / TILE_SIZE)
        ] === 5
      )
    )
      this.velocity = new Vector2(-BAGEL_SPEED, this.velocity.y);
    if (
      this.follow.getPosition().x > this.getRight() &&
      !(
        this.worldMap[Math.floor(this.position.y / TILE_SIZE)][
          Math.ceil((this.position.x + this.velocity.x) / TILE_SIZE)
        ] === 5 ||
        this.worldMap[Math.floor(this.getBottom() / TILE_SIZE)][
          Math.ceil((this.position.x + this.velocity.x) / TILE_SIZE)
        ] === 5
      )
    )
      this.velocity = new Vector2(BAGEL_SPEED, this.velocity.y);
    if (
      this.follow.getPosition().y < this.position.y &&
      !(
        this.worldMap[Math.floor((this.position.y + this.velocity.y) / TILE_SIZE)][
          Math.floor(this.position.x / TILE_SIZE)
        ] === 5 ||
        this.worldMap[Math.floor((this.position.y + this.velocity.y) / TILE_SIZE)][
          Math.floor(this.getBottom() / TILE_SIZE)
        ] === 5
      )
    )
      this.velocity = new Vector2(this.velocity.x, -BAGEL_SPEED);
    if (
      this.follow.getPosition().y > this.getBottom() &&
      !(
        this.worldMap[Math.ceil((this.position.y + this.velocity.y) / TILE_SIZE)][
          Math.floor(this.position.x / TILE_SIZE)
        ] === 5 ||
        this.worldMap[Math.ceil((this.position.y + this.velocity.y) / TILE_SIZE)][
          Math.floor(this.getRight() / TILE_SIZE)
        ] === 5
      )
    )
      this.velocity = new Vector2(this.velocity.x, BAGEL_SPEED);

    this.followTimer += 1;

    if (this.followTimer >= 1000 && this.isInRadius(this.follow)) {
      this.follow = undefined;
      this.followTimer = 0;
    }

    this.position.add(this.velocity);
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.position.x - camera.getPosition().x,
      this.position.y - camera.getPosition().y,
      this.width,
      this.height
    );
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

  public isInRadius(gameObject: GameObject): boolean {
    return (
      this.getBottom() + DETECTION_RADIUS_OFFSET <= gameObject.getPosition().y ||
      this.position.y - DETECTION_RADIUS_OFFSET >= gameObject.getBottom() ||
      this.getRight() + DETECTION_RADIUS_OFFSET <= gameObject.getPosition().x ||
      this.position.x - DETECTION_RADIUS_OFFSET >= gameObject.getRight()
    );
  }

  public isFollowableItem(tag: string): boolean {
    return ["player"].includes(tag);
  }
}

export default Bagel;