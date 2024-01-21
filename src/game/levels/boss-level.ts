import Camera from "../entities/camera";
import WizardBoss from "../entities/enemies/wizard-boss";
import GameManager from "../game-manager";
import Vector2 from "../math/vector2";

class BossLevel {
  private map: number[][];
  private camera: Camera;
  private boss: WizardBoss;

  constructor() {
    this.map = GameManager.getInstance().generateMap(this.canvas.width, this.canvas.height);
    this.generateBossRoom();
    this.generateWalls();

    GameManager.getInstance().getPlayer().setWorldMap(this.map);
    GameManager.getInstance()
      .getPlayer()
      .setPosition(
        new Vector2(
          Math.floor(this.rooms[0].getWidth() * 0.75 * TILE_SIZE),
          Math.floor(this.rooms[0].getHeight() * 0.75 * TILE_SIZE)
        )
      );
    this.boss = this.spawnBoss();
    this.gameObjects = [this.player, this.boss];
  }

  public update(deltaTime: number): void {
    if (this.boss.getHealth() <= 0) {
      GameManager.getInstance().goToNextFloor();
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {}
}

export default BossLevel;
