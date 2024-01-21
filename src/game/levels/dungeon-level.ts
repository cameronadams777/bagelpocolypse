import Level from ".";
import { MAX_BAGEL_COUNT, TILE_SIZE } from "../../constants";
import { getRandomArbitrary } from "../../helpers";
import CreamCheese from "../entities/cream-cheese";
import Bagel from "../entities/enemies/bagel";
import GameObject from "../entities/game-object";
import Salmon from "../entities/salmon";
import SpreadingTool from "../entities/weapons/spreading-tool";
import ToasterGun from "../entities/weapons/toaster-gun";
import GameManager from "../game-manager";
import Vector2 from "../math/vector2";

class DungeonLevel extends Level {
  private playerInitialSpawn: Vector2;
  constructor() {
    super();
    this.playerInitialSpawn = Vector2.Zero();
  }

  public update(deltaTime: number): void { }

  public draw(ctx: CanvasRenderingContext2D): void { }

  private spawnPlayer(): void {
    const { position, room } = generateSpawnCoordinates(this.map, this.rooms);
    this.playerInitialSpawn = position;
    GameManager.getInstance().getMap()[position.y][position.x] = 3;
    room.setHasPlayer(true);
    GameManager.getInstance().getPlayer().setPosition(new Vector2(position.x * TILE_SIZE, position.y * TILE_SIZE));
  }

  private spawnBagels(): Bagel[] {
    let attempts = 0;
    const bagels: Bagel[] = [];
    while (bagels.length < MAX_BAGEL_COUNT && attempts < 10) {
      const { position, room } = generateSpawnCoordinates(this.map, this.rooms);
      if (!room.getHasPlayer() && !room.getHasStairs()) {
        GameManager.getInstance().getMap()[position.y][position.x] = 4;
        bagels.push(
          new Bagel(new Vector2(position.x * TILE_SIZE, position.y * TILE_SIZE), TILE_SIZE, TILE_SIZE, this.map)
        );
        attempts = 0;
        continue;
      }
      attempts += 1;
    }
    return bagels;
  }

  private spawnWeaponsAndPowerUps(): GameObject[] {
    const objects: GameObject[] = [];
    const randoms = [6, 7, 20, 21];
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.round(getRandomArbitrary(0, randoms.length - 1));
      const { position } = generateSpawnCoordinates(this.map, this.rooms);
      this.map[position.y][position.x] = randoms[randomIndex];
      if (randoms[randomIndex] === 6) {
        objects.push(new Salmon(new Vector2(position.x * TILE_SIZE, position.y * TILE_SIZE), TILE_SIZE, TILE_SIZE));
      } else if (randoms[randomIndex] === 20) {
        objects.push(new ToasterGun(new Vector2(position.x * TILE_SIZE, position.y * TILE_SIZE), TILE_SIZE, TILE_SIZE));
      } else if (randoms[randomIndex] === 21) {
        objects.push(
          new CreamCheese(new Vector2(position.x * TILE_SIZE, position.y * TILE_SIZE), TILE_SIZE, TILE_SIZE)
        );
      } else {
        objects.push(
          new SpreadingTool(new Vector2(position.x * TILE_SIZE, position.y * TILE_SIZE), TILE_SIZE, TILE_SIZE)
        );
      }
    }
    return objects;
  }
}

export default DungeonLevel;
