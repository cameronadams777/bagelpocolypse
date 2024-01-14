import GameObject from "./game-object";
import { PLAYER_SPEED } from "../../constants";
import PlayerSprite from "../../assets/images/player-sheet.png";
import Vector2 from "../math/vector2";
import Camera from "./camera";

const sprite = new Image();
sprite.src = PlayerSprite;

const PLAYER_SPRITE_SCALE_OFFSET = 5;

class Player extends GameObject {
  private velocity: Vector2;
  private lives: number;
  private frameCount: number;
  private currentFrameX: number;
  private currentFrameY: number;
  private playerSpeedConstant: number;

  constructor(tag: string, position: Vector2, width: number, height: number) {
    super(tag, position, width, height);
    this.velocity = Vector2.Zero();
    this.lives = 3;
    this.frameCount = 4;
    this.currentFrameX = 0;
    this.currentFrameY = 0;
    this.playerSpeedConstant = PLAYER_SPEED;
    this.setupKeyboardHandlers();
  }

  public update(): void {
    this.position.add(this.velocity);
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    const frameX = Math.floor(this.currentFrameX % this.frameCount);
    ctx.drawImage(
      sprite,
      frameX * this.width * PLAYER_SPRITE_SCALE_OFFSET,
      this.currentFrameY * this.height * PLAYER_SPRITE_SCALE_OFFSET,
      this.width * PLAYER_SPRITE_SCALE_OFFSET,
      this.height * PLAYER_SPRITE_SCALE_OFFSET,
      this.position.x - camera.getPosition().x,
      this.position.y - camera.getPosition().y,
      this.width,
      this.height
    );
    /*ctx.font = `40px Verdana`;
    ctx.fillStyle = "#000";
    ctx.fillText(this.lives.toString(), 25, 35);*/
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

  private setupKeyboardHandlers(): void {
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "w") {
        this.setCurrentFrameY(1);
        this.setCurrentFrameX(this.getCurrentFrameX() + 1);
        this.setVelocity(new Vector2(this.velocity.x, -this.playerSpeedConstant));
      } else if (e.key === "s") {
        this.setCurrentFrameY(0);
        this.setCurrentFrameX(this.getCurrentFrameX() + 1);
        this.setVelocity(new Vector2(this.velocity.x, this.playerSpeedConstant));
      } else if (e.key === "a") {
        this.setCurrentFrameY(2);
        this.setCurrentFrameX(this.getCurrentFrameX() + 1);
        this.setVelocity(new Vector2(-this.playerSpeedConstant, this.velocity.y));
      } else if (e.key === "d") {
        this.setCurrentFrameY(3);
        this.setCurrentFrameX(this.getCurrentFrameX() + 1);
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
        this.setCurrentFrameX(3);
        this.setVelocity(new Vector2(0, this.velocity.y));
      }
    });
  }
}

export default Player;
