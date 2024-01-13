import GameObject from "./game-object";
import PlayerSprite from "../assets/images/player-sheet.png";
import { PLAYER_SPEED, TILE_SIZE } from "../constants";

const sprite = new Image();
sprite.src = PlayerSprite;

const PLAYER_SPRITE_SCALE_OFFSET = 5;

class Player extends GameObject {
  private velX: number;
  private velY: number;
  private lives: number;
  private frameCount: number;
  private currentFrameX: number;
  private currentFrameY: number;
  private playerSpeedConstant: number;

  constructor(tag: string, x: number, y: number, width: number, height: number) {
    super(tag, x, y, width, height);
    this.velX = 0;
    this.velY = 0;
    this.lives = 3;
    this.frameCount = 4;
    this.currentFrameX = 0;
    this.currentFrameY = 0;
    this.playerSpeedConstant = PLAYER_SPEED;
    this.setupKeyboardHandlers();
  }

  public update(map: number[][]): void {
    if (this.velX < 0 && map[Math.floor(this.y / TILE_SIZE)][(Math.floor(this.x / TILE_SIZE)) + 1] === 0) this.velX = 0;
    if (this.velX > 0 && map[Math.floor(this.y / TILE_SIZE)][(Math.floor(this.x / TILE_SIZE)) + 1] === 0) this.velX = 0;
    if (this.velY < 0 && map[(Math.floor(this.y / TILE_SIZE)) + 1][Math.floor(this.x / TILE_SIZE)] === 0) this.velY = 0;
    if (this.velY > 0 && map[(Math.floor(this.y / TILE_SIZE)) + 1][Math.floor(this.x / TILE_SIZE)] === 0) this.velY = 0;
    this.x += this.velX;
    this.y += this.velY;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    const frameX = Math.floor(this.currentFrameX % this.frameCount);
    ctx.drawImage(sprite, frameX * this.width * PLAYER_SPRITE_SCALE_OFFSET, this.currentFrameY * this.height * PLAYER_SPRITE_SCALE_OFFSET, this.width * PLAYER_SPRITE_SCALE_OFFSET, this.height * PLAYER_SPRITE_SCALE_OFFSET, this.x, this.y, this.width, this.height);
    ctx.font = `40px Verdana`;
    ctx.fillStyle = "#000";
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

  public getPlayerSpeedConstant(): number {
    return this.playerSpeedConstant;
  }

  public setPlayerSpeedConstant(speed: number): void {
    this.playerSpeedConstant = speed;
  }

  private setupKeyboardHandlers(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === "w") {
        this.setCurrentFrameY(1);
        this.setCurrentFrameX(this.getCurrentFrameX() + 1);
        this.setVelY(-PLAYER_SPEED);
      }
      else if (e.key === "s") {
        this.setCurrentFrameY(0);
        this.setCurrentFrameX(this.getCurrentFrameX() + 1);
        this.setVelY(PLAYER_SPEED);
      }
      else if (e.key === "a") {
        this.setCurrentFrameY(2);
        this.setCurrentFrameX(this.getCurrentFrameX() + 1);
        this.setVelX(-PLAYER_SPEED);
      }
      else if (e.key === "d") {
        this.setCurrentFrameY(3);
        this.setCurrentFrameX(this.getCurrentFrameX() + 1);
        this.setVelX(PLAYER_SPEED);
      }
    });

    document.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key === "w") {
        this.setCurrentFrameX(0);
        this.setVelY(0);
      }
      else if (e.key === "s") {
        this.setCurrentFrameX(0);
        this.setVelY(0);
      }
      else if (e.key === "a") {
        this.setCurrentFrameX(0);
        this.setVelX(0);
      }
      else if (e.key === "d") {
        this.setCurrentFrameX(3);
        this.setVelX(0);
      }
    })
  }
}

export default Player;
