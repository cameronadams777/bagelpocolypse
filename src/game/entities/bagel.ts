import GameObject from "./game-object";
import Vector2 from "../math/vector2";

type BagelState = "idle" | "following";

const DETECTION_RADIUS_OFFSET = 100;

class Bagel extends GameObject {
  private velocity: Vector2;
  private state: BagelState;
  private follow: GameObject | undefined;

  constructor(tag: string, position: Vector2, width: number, height: number) {
    super(tag, position, width, height);
    this.velocity = Vector2.Zero();
    this.state = "idle";
    this.follow = undefined;
  }

  public update(): void {
    this.velocity = Vector2.Zero();
    if (this.follow == null) return;
    if (this.state === "following") {
      if (this.follow.getPosition().x < this.position.x) this.velocity = new Vector2(-3.5, this.velocity.y);
      if (this.follow.getPosition().x > this.getRight()) this.velocity = new Vector2(3.5, this.velocity.y);
      if (this.follow.getPosition().y < this.position.y) this.velocity = new Vector2(this.velocity.x, -3.5);
      if (this.follow.getPosition().y > this.getBottom()) this.velocity = new Vector2(this.velocity.x, 3.5);
    }

    this.position.add(this.velocity);
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  public getVelocity(): Vector2 {
    return this.velocity;
  }

  public setVelocity(velocity: Vector2): void {
    this.velocity = velocity;
  }

  public getState(): BagelState {
    return this.state;
  }

  public setState(state: BagelState): void {
    this.state = state;
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
