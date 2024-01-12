import GameObject from "./game-object";

class Player extends GameObject {
  private velX: number;
  private velY: number;
  private lives: number;

  constructor(tag: string, x: number, y: number, width: number, height: number) {
    super(tag, x, y, width, height);
    this.velX = 0;
    this.velY = 0;
    this.lives = 3;
  }

  public update(): void {
    this.x += this.velX;
    this.y += this.velY;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#fff";
    ctx.fillRect(this.x, this.y, this.width, this.height)
    ctx.font = `40px Verdana`;
    ctx.fillText(this.lives.toString(), 25, 35);
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

  public getLives(): number {
    return this.lives;
  }

  public setLives(lives: number): void {
    this.lives = lives;
  }
}

export default Player;
