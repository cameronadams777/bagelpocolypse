import GameObject from "./game-object";
import { GameTag, MAP_CONSTANTS, MAX_PLAYER_SPEED, TILE_SIZE } from "@/constants";
import PlayerSprite from "@/assets/images/player-sheet.png";
import SpreadingToolImage from "@/assets/images/spreading-tool-Sheet.png";
import HeartSprite from "@/assets/images/heart.png";
import ToasterGunSprite from "@/assets/images/toaster-gun-Sheet.png";
import FireballSprite from "@/assets/images/fire-attack-Sheet.png";
import FireballSound from "@/assets/sounds/fireball.mp3";
import { clamp } from "@/helpers";
import Vector2 from "../math/vector2";
import Camera from "./camera";

const fireballSound = new Audio(FireballSound);

const sprite = new Image();
sprite.src = PlayerSprite;

const spreadingToolSprite = new Image();
spreadingToolSprite.src = SpreadingToolImage;

const heartSprite = new Image();
heartSprite.src = HeartSprite;

const toasterGunSprite = new Image();
toasterGunSprite.src = ToasterGunSprite;

const fireballSprite = new Image();
fireballSprite.src = FireballSprite;

const FIREBALL_SPEED = 7;

class Fireball extends GameObject {
  private velocity: Vector2;
  private liveTime: number;
  private frameY: number;

  constructor(position: Vector2, width: number, height: number, velocity: Vector2) {
    super(GameTag.FIREBALL, position, width, height);
    this.velocity = velocity;
    this.liveTime = 0;
    this.frameY = 0;
  }

  public update(deltaTime: number): void {
    this.liveTime += 1;

    this.velocity.x = clamp(this.velocity.x * deltaTime, -FIREBALL_SPEED, FIREBALL_SPEED);
    this.velocity.y = clamp(this.velocity.y * deltaTime, -FIREBALL_SPEED, FIREBALL_SPEED);

    this.position.add(this.velocity);
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (this.velocity.y < 0) this.frameY = 0;
    else if (this.velocity.y > 0) this.frameY = 2;
    else if (this.velocity.x > 0) this.frameY = 1;
    else if (this.velocity.x < 0) this.frameY = 3;

    ctx.drawImage(
      fireballSprite,
      1,
      this.frameY * this.height,
      this.width,
      this.height,
      this.position.x - camera.getPosition().x,
      this.position.y - camera.getPosition().y,
      this.width,
      this.height
    );
  }

  public getLiveTime(): number {
    return this.liveTime;
  }
}

class Player extends GameObject {
  private velocity: Vector2;
  private lives: number;
  private frameX: number;
  private frameCount: number;
  private deltaFrameX: number;
  private currentFrameY: number;
  private playerSpeedConstant: number;
  private spreadingToolCount: number;
  private worldMap: number[][];
  private shotTimer: number;
  private toasterGunShotCount: number;
  private attackObjects: Array<Fireball | undefined>;

  constructor(position: Vector2, width: number, height: number, map: number[][]) {
    super(GameTag.PLAYER_TAG, position, width, height);
    this.worldMap = map;
    this.velocity = Vector2.Zero();
    this.lives = 3;
    this.frameX = 0;
    this.frameCount = 4;
    this.deltaFrameX = 0;
    this.currentFrameY = 0;
    this.playerSpeedConstant = MAX_PLAYER_SPEED;
    this.spreadingToolCount = 0;
    this.shotTimer = 0;
    this.toasterGunShotCount = 5;
    this.attackObjects = [];
    this.setupKeyboardHandlers();
  }

  public update(deltaTime: number): void {
    for (let i = 0; i < this.attackObjects.length; i++) {
      if (this.attackObjects[i] == null) continue;
      const object = this.attackObjects[i] as Fireball;
      object.update(deltaTime);

      if (object.getLiveTime() > 75) {
        this.attackObjects[i] = undefined;
      }
    }

    if (
      this.velocity.x < 0 &&
      (MAP_CONSTANTS.includes(
        this.worldMap[Math.floor(this.getBottom() / TILE_SIZE)][
          Math.floor((this.position.x + this.velocity.x) / TILE_SIZE)
        ]
      ) ||
        MAP_CONSTANTS.includes(
          this.worldMap[Math.floor(this.position.y / TILE_SIZE)][
            Math.floor((this.position.x + this.velocity.x) / TILE_SIZE)
          ]
        ))
    ) {
      this.position.x += 0.5;
      this.velocity.x = 0;
    }
    if (
      this.velocity.x > 0 &&
      (MAP_CONSTANTS.includes(
        this.worldMap[Math.floor(this.position.y / TILE_SIZE)][
          Math.ceil((this.position.x + this.velocity.x) / TILE_SIZE)
        ]
      ) ||
        MAP_CONSTANTS.includes(
          this.worldMap[Math.floor(this.getBottom() / TILE_SIZE)][
            Math.ceil((this.position.x + this.velocity.x) / TILE_SIZE)
          ]
        ))
    ) {
      this.position.x -= 0.5;
      this.velocity.x = 0;
    }
    if (
      this.velocity.y < 0 &&
      (MAP_CONSTANTS.includes(
        this.worldMap[Math.floor((this.position.y + this.velocity.y) / TILE_SIZE)][
          Math.floor(this.position.x / TILE_SIZE)
        ]
      ) ||
        MAP_CONSTANTS.includes(
          this.worldMap[Math.floor((this.position.y + this.velocity.y) / TILE_SIZE)][
            Math.floor(this.getRight() / TILE_SIZE)
          ]
        ))
    ) {
      this.position.y += 0.5;
      this.velocity.y = 0;
    }
    if (
      this.velocity.y > 0 &&
      (MAP_CONSTANTS.includes(
        this.worldMap[Math.ceil((this.position.y + this.velocity.y) / TILE_SIZE)][
          Math.floor(this.position.x / TILE_SIZE)
        ]
      ) ||
        MAP_CONSTANTS.includes(
          this.worldMap[Math.ceil((this.position.y + this.velocity.y) / TILE_SIZE)][
            Math.floor(this.getRight() / TILE_SIZE)
          ]
        ))
    ) {
      this.position.y -= 0.5;
      this.velocity.y = 0;
    }

    if (this.shotTimer > 0) {
      this.shotTimer += 1;

      if (this.shotTimer >= 50) {
        this.shotTimer = 0;
      }
    }

    this.velocity.x = clamp(this.velocity.x * deltaTime, -this.playerSpeedConstant, this.playerSpeedConstant);
    this.velocity.y = clamp(this.velocity.y * deltaTime, -this.playerSpeedConstant, this.playerSpeedConstant);

    this.position.add(this.velocity);
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (this.velocity.x > 0) this.currentFrameY = 3;
    if (this.velocity.x < 0) this.currentFrameY = 2;
    if (this.velocity.y > 0) this.currentFrameY = 0;
    if (this.velocity.y < 0) this.currentFrameY = 1;

    if (Math.abs(this.velocity.x) > 0) this.deltaFrameX += 1;
    if (Math.abs(this.velocity.y) > 0) this.deltaFrameX += 1;

    if (this.deltaFrameX % 5 === 1) this.frameX += 1;
    if (this.frameX >= this.frameCount) this.frameX = 0;
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

    for (let i = 0; i < this.lives; i++) {
      ctx.drawImage(heartSprite, camera.getWidth() - TILE_SIZE - 50 * (i + 1), 25);
    }

    ctx.drawImage(
      toasterGunSprite,
      1,
      1,
      TILE_SIZE - 1,
      TILE_SIZE,
      camera.getWidth() - TILE_SIZE - 50,
      85,
      TILE_SIZE,
      TILE_SIZE
    );
    ctx.fillStyle = "orange";
    ctx.fillRect(camera.getWidth() - 100, 87, -(this.toasterGunShotCount * 4), 25);

    for (let i = 0; i < this.spreadingToolCount; i++) {
      ctx.drawImage(
        spreadingToolSprite,
        1,
        1,
        TILE_SIZE - 1,
        TILE_SIZE,
        camera.getWidth() - TILE_SIZE - 50 * (i + 1),
        135,
        TILE_SIZE,
        TILE_SIZE
      );
    }

    for (let i = 0; i < this.attackObjects.length; i++) {
      if (this.attackObjects[i] == null) continue;
      this.attackObjects[i]?.draw(ctx, camera);
    }
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
    return this.deltaFrameX;
  }

  public setCurrentFrameX(deltaFrameX: number): void {
    this.deltaFrameX = deltaFrameX;
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

  public setWorldMap(map: number[][]): void {
    this.worldMap = map;
  }

  public getToastGunShotCount(): number {
    return this.toasterGunShotCount;
  }

  public setToasterGunShotCount(shotCount: number): void {
    this.toasterGunShotCount = shotCount;
  }

  public getAttackObjects(): Array<Fireball | undefined> {
    return this.attackObjects;
  }

  public setAttackObjects(attackObjects: Array<Fireball | undefined>) {
    this.attackObjects = attackObjects;
  }

  public removeAttackObject(index: number): void {
    this.attackObjects[index] = undefined;
  }

  private setupKeyboardHandlers(): void {
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "ArrowUp") {
        this.currentFrameY = 1;
        this.velocity.y = -this.playerSpeedConstant;
      }
      if (e.key === "s" || e.key === "ArrowDown") {
        this.currentFrameY = 0;
        this.velocity.y = this.playerSpeedConstant;
      }
      if (e.key === "a" || e.key === "ArrowLeft") {
        this.currentFrameY = 2;
        this.velocity.x = -this.playerSpeedConstant;
      }
      if (e.key === "d" || e.key === "ArrowRight") {
        this.currentFrameY = 3;
        this.velocity.x = this.playerSpeedConstant;
      }
      if (e.code === "Space" && this.toasterGunShotCount > 0 && this.shotTimer === 0) {
        fireballSound.play();
        this.toasterGunShotCount -= 1;
        const xVel = this.currentFrameY === 2 ? -FIREBALL_SPEED : this.currentFrameY === 3 ? FIREBALL_SPEED : 0;
        const yVel = this.currentFrameY === 1 ? -FIREBALL_SPEED : this.currentFrameY === 0 ? FIREBALL_SPEED : 0;
        this.attackObjects.push(
          new Fireball(new Vector2(this.position.x, this.position.y), TILE_SIZE, TILE_SIZE, new Vector2(xVel, yVel))
        );
        this.shotTimer += 1;
      }
    });

    document.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "ArrowUp") {
        this.deltaFrameX = 0;
        this.frameX = 0;
        this.velocity.y = 0;
      } else if (e.key === "s" || e.key === "ArrowDown") {
        this.deltaFrameX = 0;
        this.frameX = 0;
        this.velocity.y = 0;
      } else if (e.key === "a" || e.key === "ArrowLeft") {
        this.deltaFrameX = 0;
        this.frameX = 0;
        this.velocity.x = 0;
      } else if (e.key === "d" || e.key === "ArrowRight") {
        this.deltaFrameX = 0;
        this.frameX = 0;
        this.velocity.x = 0;
      }
    });
  }
}

export default Player;
