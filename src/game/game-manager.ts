import { TILE_SIZE } from "../constants";
import Player from "./entities/player";
import Level, { LevelType } from "./levels";
import BossLevel from "./levels/boss-level";
import DungeonLevel from "./levels/dungeon-level";
import Vector2 from "./math/vector2";

class GameManager {
  private static instance: GameManager;
  private map: number[][];
  private floorNumber: number;
  private currentLevel: Level;
  private player: Player;

  public static getInstance(): GameManager {
    if (!this.instance) {
      GameManager.instance = new GameManager();
    }
    return this.instance;
  }

  public resetFloorNumber(): void {
    this.floorNumber = 1;
  }

  public goToNextFloor(levelType: LevelType): void {
    this.floorNumber += 1;
    GameManager.getInstance().loadLevel(levelType);
  }

  public getPlayer(): Player {
    return this.player;
  }

  public getCurrentLevel(): Level {
    return this.currentLevel;
  }

  public getMap(): number[][] {
    return this.map;
  }

  public generateMap(sizeX: number, sizeY: number): number[][] {
    let map: number[][] = [];
    for (let j = 0; j < Math.ceil(sizeY / TILE_SIZE); j++) {
      map.push([]);
      for (let i = 0; i < Math.ceil(sizeX / TILE_SIZE); i++) {
        map[j].push(0);
      }
    }
    return map;
  }

  public loadLevel(levelType: LevelType): void {
    if (levelType === LevelType.DUNGEON_LEVEL) {
      this.currentLevel = new DungeonLevel();
      return;
    }
    this.currentLevel = new BossLevel();
  }

  private constructor() {
    this.floorNumber = 1;
    this.currentLevel = new DungeonLevel();
    this.player = new Player(Vector2.Zero(), TILE_SIZE, TILE_SIZE);
  }
}

export default GameManager;
