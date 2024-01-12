import GameObject from "./game-object";

class Bagel extends GameObject {
  private velX: number;
  private velY: number;

  constructor(tag: string, x: number, y: number, width: number, height: number) {
    super(tag, x, y, width, height);
    this.velX = 0;
    this.velY = 0;
  }

  public update(): void {
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
}

export default Bagel;
