import GameObject from "./game-object";

type BagelState = "idle" | "following";

const DETECTION_RADIUS_OFFSET = 100;

class Bagel extends GameObject {
  private velX: number;
  private velY: number;
  private state: BagelState;
  private follow: GameObject | undefined;

  constructor(tag: string, x: number, y: number, width: number, height: number) {
    super(tag, x, y, width, height);
    this.velX = 0;
    this.velY = 0;
    this.state = "idle";
    this.follow = undefined;
  }

  public update(): void {
    this.velX = 0;
    this.velY = 0;
    if (this.follow == null) return;
    if (this.state === "following") {
      if (this.follow.getX() < this.x) this.velX = -3.5;
      if (this.follow.getX() > this.x + this.width) this.velX = 3.5;
      if (this.follow.getY() < this.y) this.velY = -3.5;
      if (this.follow.getY() > this.y + this.height) this.velY = 3.5;
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  public getVelX(): number {
    return this.velX;
  }

  public setVelX(velX: number): void {
    this.velX = velX;
  }

  public getVelY(): number {
    return this.velY;
  }

  public setVelY(velY: number): void {
    this.velY = velY;
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
      ((this.y + this.height + DETECTION_RADIUS_OFFSET) <= (gameObject.getY())) ||
      (this.y - DETECTION_RADIUS_OFFSET >= (gameObject.getY() + gameObject.getHeight())) ||
      ((this.x + this.width + DETECTION_RADIUS_OFFSET) <= gameObject.getX()) ||
      (this.x - DETECTION_RADIUS_OFFSET >= (gameObject.getX() + gameObject.getWidth()))
    );
  }

  public isFollowableItem(tag: string): boolean {
    return ["player"].includes(tag);
  }
}

export default Bagel;
