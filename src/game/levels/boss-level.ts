import { LevelType, TILE_SIZE } from "../../constants";
import Camera from "../entities/camera";
import WizardBoss from "../entities/enemies/wizard-boss";
import GameObject from "../entities/game-object";
import GameManager from "../game-manager";
import Vector2 from "../math/vector2";

class BossLevel {
  private camera: Camera;
  private gameObjects: Array<GameObject | undefined>;
  private boss: WizardBoss;

  constructor() {
    const map = GameManager.getInstance().getMap();
    GameManager.getInstance()
      .getPlayer()
      .setPosition(
        new Vector2(
          Math.floor(map.getRooms()[0].getWidth() * 0.75 * TILE_SIZE),
          Math.floor(map.getRooms()[0].getHeight() * 0.75 * TILE_SIZE)
        )
      );
    this.boss = this.spawnBoss();
    this.gameObjects = [GameManager.getInstance().getPlayer(), this.boss];
  }

  public update(deltaTime: number): void {
    if (this.boss.getHealth() <= 0) {
      GameManager.getInstance().goToNextFloor(LevelType.DUNGEON_LEVEL);
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {}

  private spawnBoss(): WizardBoss {
    const { position } = generateSpawnCoordinates(this.map, this.rooms);
    GameManager.getInstance().getMap()[position.y][position.x] = 19;
    return new WizardBoss(
      new Vector2(position.x * TILE_SIZE, position.y * TILE_SIZE),
      TILE_SIZE,
      TILE_SIZE,
      GameManager.getInstance().getPlayer()
    );
  }
}

export default BossLevel;
