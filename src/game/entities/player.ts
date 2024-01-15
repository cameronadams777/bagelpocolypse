import GameObject from "./game-object";
import { MAP_CONSTANTS, PLAYER_SPEED, TILE_SIZE } from "../../constants";
import PlayerSprite from "../../assets/images/player-sheet.png";
import Vector2 from "../math/vector2";
import Camera from "./camera";

const sprite = new Image();
sprite.src = PlayerSprite;

const PLAYER_SPRITE_SCALE_OFFSET = 5;

class Player extends GameObject {
  private velocity: Vector2;
  private lives: number;
  private frameX: number;
  private frameCount: number;
  private currentFrameX: number;
  private currentFrameY: number;
  private playerSpeedConstant: number;
  private spreadingToolCount: number;
  private worldMap: number[][];

  constructor(tag: string, position: Vector2, width: number, height: number, map: number[][]) {
    super(tag, position, width, height);
    this.worldMap = map;
    this.velocity = Vector2.Zero();
    this.lives = 3;
    this.frameX = 0;
    this.frameCount = 4;
    this.currentFrameX = 0;
    this.currentFrameY = 0;
    this.playerSpeedConstant = PLAYER_SPEED;
    this.spreadingToolCount = 0;
    this.setupKeyboardHandlers();
  }

  public update(): void {
    if (
      this.velocity.x < 0 &&
      (MAP_CONSTANTS.includes(this.worldMap[Math.floor(this.getBottom() / TILE_SIZE)][
        Math.floor((this.position.x + this.velocity.x) / TILE_SIZE)
      ]) ||
        MAP_CONSTANTS.includes(this.worldMap[Math.floor(this.position.y / TILE_SIZE)][
          Math.floor((this.position.x + this.velocity.x) / TILE_SIZE)
        ]))
    )
      this.velocity.x = 0;
    if (
      this.velocity.x > 0 &&
      (MAP_CONSTANTS.includes(this.worldMap[Math.floor(this.position.y / TILE_SIZE)][
        Math.ceil((this.position.x + this.velocity.x) / TILE_SIZE)
      ]) ||
        MAP_CONSTANTS.includes(this.worldMap[Math.floor(this.getBottom() / TILE_SIZE)][
          Math.ceil((this.position.x + this.velocity.x) / TILE_SIZE)
        ]))
    )
      this.velocity.x = 0;
    if (
      this.velocity.y < 0 &&
      (MAP_CONSTANTS.includes(this.worldMap[Math.floor((this.position.y + this.velocity.y) / TILE_SIZE)][
        Math.floor(this.position.x / TILE_SIZE)
      ]) ||
        MAP_CONSTANTS.includes(this.worldMap[Math.floor((this.position.y + this.velocity.y) / TILE_SIZE)][
          Math.floor(this.getRight() / TILE_SIZE)
        ]))
    )
      this.velocity.y = 0;
    if (
      this.velocity.y > 0 &&
      (MAP_CONSTANTS.includes(this.worldMap[Math.ceil((this.position.y + this.velocity.y) / TILE_SIZE)][
        Math.floor(this.position.x / TILE_SIZE)
      ]) ||
        MAP_CONSTANTS.includes(this.worldMap[Math.ceil((this.position.y + this.velocity.y) / TILE_SIZE)][
          Math.floor(this.getRight() / TILE_SIZE)
        ]))
    )
      this.velocity.y = 0;

    this.position.add(this.velocity);
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (this.currentFrameX >= this.frameCount) this.currentFrameX = 0;
    this.frameX = this.currentFrameX;
    ctx.drawImage(
      sprite,
      this.frameX * this.width,
      this.currentFrameY * this.height,
      this.width,
      this.height,
      this.position.x - camera.getPosition().x,
      this.position.y - camera.getPosition().y,
      this.width,
      this.height
    );

    ctx.font = `40px Verdana`;
    ctx.fillStyle = "red";
    const livesText = `Lives: ${this.lives.toString()}`;
    ctx.fillText(livesText, camera.getWidth() - ctx.measureText(livesText).width - 50, 50);
  }

  public getVelocity(): Vector2 {
    return this.velocity;
  }

  public setVelocity(velocity: Vector2): void {
    this.velocity = velocity;
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

  public getSpreadingToolCount(): number {
    return this.spreadingToolCount;
  }

  public setSpreadingToolCount(count: number): void {
    this.spreadingToolCount = count;
  }

  private setupKeyboardHandlers(): void {
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "w") {
        this.setCurrentFrameY(1);
        this.setCurrentFrameX(this.currentFrameX + 1);
        this.setVelocity(new Vector2(this.velocity.x, -this.playerSpeedConstant));
      } else if (e.key === "s") {
        this.setCurrentFrameY(0);
        this.setCurrentFrameX(this.currentFrameX + 1);
        this.setVelocity(new Vector2(this.velocity.x, this.playerSpeedConstant));
      } else if (e.key === "a") {
        this.setCurrentFrameY(2);
        this.setCurrentFrameX(this.currentFrameX + 1);
        this.setVelocity(new Vector2(-this.playerSpeedConstant, this.velocity.y));
      } else if (e.key === "d") {
        this.setCurrentFrameY(3);
        this.setCurrentFrameX(this.currentFrameX + 1);
        this.setVelocity(new Vector2(this.playerSpeedConstant, this.velocity.y));
      }
    });

    document.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key === "w") {
        this.setCurrentFrameX(0);
        this.setVelocity(new Vector2(this.velocity.x, 0));
      } else if (e.key === "s") {
        this.setCurrentFrameX(0);
        this.setVelocity(new Vector2(this.velocity.x, 0));
      } else if (e.key === "a") {
        this.setCurrentFrameX(0);
        this.setVelocity(new Vector2(0, this.velocity.y));
      } else if (e.key === "d") {
        this.setCurrentFrameX(0);
        this.setVelocity(new Vector2(0, this.velocity.y));
      }
    });
  }
}

export default Player;
