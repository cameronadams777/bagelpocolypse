import GameObject from "./game-object";
import PlayerSprite from "../assets/images/player-sheet.png";

const sprite = new Image();
sprite.src = PlayerSprite;

const PLAYER_SPRITE_SCALE_OFFSET = 10;

class Player extends GameObject {
  private velX: number;
  private velY: number;
  private lives: number;
  private frameCount: number;
  private currentFrameX: number;
  private currentFrameY: number;

  constructor(tag: string, x: number, y: number, width: number, height: number) {
    super(tag, x, y, width, height);
    this.velX = 0;
    this.velY = 0;
    this.lives = 3;
    this.frameCount = 4;
    this.currentFrameX = 0;
    this.currentFrameY = 0;
  }

  public update(): void {
    if (this.velX < 0 && this.x <= 0) this.velX = 0;
    if (this.velX > 0 && this.x + this.width >= window.innerWidth) this.velX = 0;
    if (this.velY < 0 && this.y <= 0) this.velY = 0;
    if (this.velY > 0 && this.y + this.height >= window.innerHeight) this.velY = 0;
    this.x += this.velX;
    this.y += this.velY;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    const frameX = Math.floor(this.currentFrameX % this.frameCount);
    ctx.drawImage(sprite, frameX * this.width * PLAYER_SPRITE_SCALE_OFFSET, this.currentFrameY * this.height * PLAYER_SPRITE_SCALE_OFFSET, this.width * PLAYER_SPRITE_SCALE_OFFSET, this.height * PLAYER_SPRITE_SCALE_OFFSET, this.x, this.y, this.width, this.height);
    ctx.font = `40px Verdana`;
    ctx.fillText(this.lives.toString(), 25, 35);
    ctx.scale(1, 1);
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

  public getCurrentFrameX(): number {
    return this.currentFrameX;
  }

  public setCurrentFrameX(currentFrameX: number): void {
    this.currentFrameX = currentFrameX;
  }

  public getCurrentFrameY(): number {
    return this.currentFrameY;
  }

  public setCurrentFrameY(currentFrameY: number): void {
    this.currentFrameY = currentFrameY;
  }
}

export default Player;
