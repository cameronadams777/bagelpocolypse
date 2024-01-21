import { BAGEL_SPEED, GameTag, TILE_SIZE } from "../../../constants";
import { clamp } from "../../../helpers";
import Vector2 from "../../math/vector2";
import Camera from "../camera";
import GameObject from "../game-object";
import Player from "../player";

const TARGET_RANGE = 2;

class BagelMagic extends GameObject {
  private target: Vector2;
  private velocity: Vector2;

  constructor(position: Vector2, width: number, height: number, target: Vector2) {
    super(GameTag.BAGEL_MAGIC, position, width, height);
    this.target = target;
    this.velocity = Vector2.Zero();
  }

  public update(deltaTime: number): void {
    if (this.position.x < this.target.x) this.velocity.x = BAGEL_SPEED;
    if (this.position.x > this.target.x) this.velocity.x = -BAGEL_SPEED;
    if (this.position.y < this.target.y) this.velocity.y = BAGEL_SPEED;
    if (this.position.y > this.target.y) this.velocity.y = -BAGEL_SPEED;

    this.velocity.x = clamp(this.velocity.x * deltaTime, -BAGEL_SPEED, BAGEL_SPEED);
    this.velocity.y = clamp(this.velocity.y * deltaTime, -BAGEL_SPEED, BAGEL_SPEED);

    this.position.add(this.velocity);
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  public nearTarget(): boolean {
    return (
      this.getBottom() + TARGET_RANGE <= this.target.y ||
      this.position.y - TARGET_RANGE >= this.target.y + TILE_SIZE ||
      this.getRight() + TARGET_RANGE <= this.target.x ||
      this.position.x - TARGET_RANGE >= this.target.x + TILE_SIZE
    );
  }
}

class WizardBoss extends GameObject {
  private player: Player;
  private health: number;
  private isActive: boolean;
  private attackSpawnTimer: number;
  private relocationTimer: number;
  private attackObjects: Array<BagelMagic | undefined>;

  constructor(position: Vector2, width: number, height: number, player: Player) {
    super(GameTag.WIZARD_BOSS, position, width, height);
    this.player = player;
    this.health = 50;
    this.attackSpawnTimer = 0;
    this.relocationTimer = 0;
    this.isActive = true;
    this.attackObjects = [];
  }

  public update(_deltaTime: number) {
    if (!this.isActive) return;
    if (this.attackSpawnTimer === 0) {
      this.attackObjects.push(
        new BagelMagic(
          new Vector2(this.position.x, this.position.y),
          TILE_SIZE / 2,
          TILE_SIZE / 2,
          new Vector2(this.player.getPosition().x, this.player.getPosition().y)
        )
      );
      this.attackSpawnTimer += 1;
    } else if (this.attackSpawnTimer >= 75) {
      this.attackSpawnTimer = 0;
    } else {
      this.attackSpawnTimer += 1;
    }

    this.relocationTimer += 1;
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    ctx.fillRect(camera.getWidth() / 2 - (this.health * 5) / 2, 25, this.health * 5, 25);
  }

  public getHealth(): number {
    return this.health;
  }

  public setHealth(health: number): void {
    this.health = health;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public setIsActive(isActive: boolean): void {
    this.isActive = isActive;
  }

  public getAttackObjects(): Array<BagelMagic | undefined> {
    return this.attackObjects;
  }

  public setAttackObjects(attackObjects: Array<BagelMagic | undefined>): void {
    this.attackObjects = attackObjects;
  }

  public removeAttackObject(index: number): void {
    this.attackObjects[index] = undefined;
  }

  public getRelocationTimer(): number {
    return this.relocationTimer;
  }

  public setRelocationTimer(relocationTimer: number): void {
    this.relocationTimer = relocationTimer;
  }
}

export default WizardBoss;
