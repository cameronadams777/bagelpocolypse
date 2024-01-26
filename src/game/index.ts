import CarpetImage from "@/assets/images/floor-carpet.png";
import BlackImage from "@/assets/images/black.png";
import StairsImage from "@/assets/images/stairs.png";
import TopLeftWallImage from "@/assets/images/top-left-wall.png";
import TopLeftInnerWallImage from "@/assets/images/top-left-inner-wall.png";
import TopWallImage from "@/assets/images/top-wall.png";
import TopRightWallImage from "@/assets/images/top-right-wall.png";
import TopRightInnerWallImage from "@/assets/images/top-right-inner-wall.png";
import RightWallImage from "@/assets/images/right-wall.png";
import BottomRightWallImage from "@/assets/images/bottom-right-wall.png";
import BottomWallImage from "@/assets/images/bottom-wall.png";
import BottomLeftWallImage from "@/assets/images/bottom-left-wall.png";
import BottomLeftInnerWallImage from "@/assets/images/bottom-left-inner-wall.png";
import LeftWallImage from "@/assets/images/left-wall.png";
import BottomRightInnerWallImage from "@/assets/images/bottom-right-inner-wall.png";
import { getRandomArbitrary, romanize } from "@/helpers";
import { Room } from "./entities/room";
import {
  BOSS_RELOCATION_TIMER_CONST,
  GameTag,
  LevelType,
  MAX_BAGEL_COUNT,
  MAX_OFFICE_WORKERS_PER_FLOOR,
  MAX_POWER_UPS_PER_FLOOR,
  MAX_ROOM_COUNT,
  MAX_ROOM_GEN_ATTEMPTS_COUNT,
  MAX_ROOM_HEIGHT,
  MAX_ROOM_WIDTH,
  MAX_SPREADING_TOOL_COUNT,
  MAX_TOASTER_GUN_SHOT_COUNT,
  MIN_ROOM_HEIGHT,
  MIN_ROOM_WIDTH,
  Scenes,
  TILE_SIZE,
  TileMap
} from "@/constants";
import Player from "./entities/player";
import Bagel from "./entities/enemies/bagel";
import GameObject from "./entities/game-object";
import Vector2 from "./math/vector2";
import Camera from "./entities/camera";
import Salmon from "./entities/salmon";
import SpreadingTool from "./entities/weapons/spreading-tool";
import WizardBoss from "./entities/enemies/wizard-boss";
import ToasterGun from "./entities/weapons/toaster-gun";
import CreamCheese from "./entities/cream-cheese";
import OfficeWorker from "./entities/office-worker";
import { Grid, AStarFinder, DiagonalMovement } from "pathfinding";

const stairsSprite = new Image();
stairsSprite.src = StairsImage;

const floorSprite = new Image();
floorSprite.src = CarpetImage;

const topLeftWallSprite = new Image();
topLeftWallSprite.src = TopLeftWallImage;

const topLeftInnerWallSprite = new Image();
topLeftInnerWallSprite.src = TopLeftInnerWallImage;

const topWallSprite = new Image();
topWallSprite.src = TopWallImage;

const topRightWallSprite = new Image();
topRightWallSprite.src = TopRightWallImage;

const topRightInnerWallSprite = new Image();
topRightInnerWallSprite.src = TopRightInnerWallImage;

const rightWallSprite = new Image();
rightWallSprite.src = RightWallImage;

const bottomRightWallSprite = new Image();
bottomRightWallSprite.src = BottomRightWallImage;

const bottomRightInnerWallSprite = new Image();
bottomRightInnerWallSprite.src = BottomRightInnerWallImage;

const bottomWallSprite = new Image();
bottomWallSprite.src = BottomWallImage;

const bottomLeftWallSprite = new Image();
bottomLeftWallSprite.src = BottomLeftWallImage;

const bottomLeftInnerWallSprite = new Image();
bottomLeftInnerWallSprite.src = BottomLeftInnerWallImage;

const leftWallSprite = new Image();
leftWallSprite.src = LeftWallImage;

const blackSprite = new Image();
blackSprite.src = BlackImage;

const tileMap: Record<TileMap, HTMLImageElement> = {
  [TileMap.BLACK]: blackSprite,
  [TileMap.FLOOR]: floorSprite,
  [TileMap.STAIRS]: stairsSprite,
  [TileMap.PLAYER]: floorSprite,
  [TileMap.BAGEL]: floorSprite,
  [TileMap.SALMON]: floorSprite,
  [TileMap.SPREADING_TOOL]: floorSprite,
  [TileMap.TOP_LEFT_WALL]: topLeftWallSprite,
  [TileMap.TOP_WALL]: topWallSprite,
  [TileMap.TOP_RIGHT_WALL]: topRightWallSprite,
  [TileMap.RIGHT_WALL]: rightWallSprite,
  [TileMap.BOTTOM_RIGHT_WALL]: bottomRightWallSprite,
  [TileMap.BOTTOM_WALL]: bottomWallSprite,
  [TileMap.BOTTOM_LEFT_WALL]: bottomLeftWallSprite,
  [TileMap.LEFT_WALL]: leftWallSprite,
  [TileMap.BOTTOM_RIGHT_WALL_INNER]: bottomRightInnerWallSprite,
  [TileMap.TOP_LEFT_WALL_INNER]: topLeftInnerWallSprite,
  [TileMap.TOP_RIGHT_WALL_INNER]: topRightInnerWallSprite,
  [TileMap.BOTTOM_LEFT_WALL_INNER]: bottomLeftInnerWallSprite,
  [TileMap.BOSS]: floorSprite,
  [TileMap.TOASTER_GUN]: floorSprite,
  [TileMap.CREAM_CHEESE]: floorSprite,
  [TileMap.OFFICE_WORKER]: floorSprite
};

const entityConstants = [
  TileMap.STAIRS,
  TileMap.PLAYER,
  TileMap.BAGEL,
  TileMap.SPREADING_TOOL,
  TileMap.SALMON,
  TileMap.TOASTER_GUN,
  TileMap.CREAM_CHEESE,
  TileMap.OFFICE_WORKER
];

const generateSpawnCoordinates = (map: number[][], rooms: Room[]): { position: Vector2; room: Room } => {
  const randRoom = rooms[getRandomArbitrary(0, rooms.length - 1)];
  let randPosition: Vector2 | undefined;
  while (randPosition == null || entityConstants.includes(map[randPosition.y][randPosition.x])) {
    randPosition = new Vector2(
      getRandomArbitrary(randRoom.getPosition().x + 2, randRoom.getRight() - 2),
      getRandomArbitrary(randRoom.getPosition().y + 2, randRoom.getBottom() - 2)
    );
  }
  return {
    position: randPosition,
    room: randRoom
  };
};

const pathfinder = new AStarFinder({
  diagonalMovement: DiagonalMovement.Never
});

class Game {
  private canvas: HTMLCanvasElement;
  private camera: Camera;
  private player: Player;
  private boss: WizardBoss;
  private playerInitialSpawn: Vector2;
  private bagels: Bagel[];
  private map: TileMap[][];
  private grid: Grid;
  private rooms: Room[];
  private gameObjects: Array<GameObject | undefined>;
  private floorLevel: number;
  private currentLevelType: LevelType;
  private randomSpawnTimer: number;
  private onChangeScene: (scene: Scenes) => void;

  constructor(canvas: HTMLCanvasElement, onChangeScene: (scene: Scenes) => void) {
    this.canvas = canvas;
    this.floorLevel = 1;
    this.camera = new Camera(Vector2.Zero(), canvas.width, canvas.height);
    this.map = [];
    this.rooms = [];
    this.bagels = [];
    this.gameObjects = [];
    this.player = new Player(Vector2.Zero(), TILE_SIZE, TILE_SIZE, this.map);
    this.boss = new WizardBoss(Vector2.Zero(), TILE_SIZE, TILE_SIZE, this.player);
    this.playerInitialSpawn = Vector2.Zero();
    this.currentLevelType = LevelType.DUNGEON_LEVEL;
    this.randomSpawnTimer = 0;
    this.onChangeScene = onChangeScene;
    this.setupDungeonLevel();
  }

  public update(deltaTime: number): void {
    const prevLives = this.player.getLives();
    for (let i = 0; i < this.gameObjects.length; i++) {
      for (let j = 0; j < this.gameObjects.length; j++) {
        if (this.gameObjects[i] == null || this.gameObjects[j] == null || this.gameObjects[i] === this.gameObjects[j])
          continue;

        // Player collision logic
        if (this.gameObjects[i]?.getTag() === GameTag.PLAYER_TAG) {
          const p = this.gameObjects[i] as Player;
          if (!p.isCollidingWith(this.gameObjects[j]!)) {
            if (this.gameObjects[j]?.getTag() === GameTag.BAGEL_TAG) {
              if (p.getSpreadingToolCount() > 0) {
                this.gameObjects[j] = undefined;
                p.setSpreadingToolCount(p.getSpreadingToolCount() - 1);
              } else {
                p.setLives(p.getLives() - 1);
                p.setPosition(
                  new Vector2(this.playerInitialSpawn.x * TILE_SIZE, this.playerInitialSpawn.y * TILE_SIZE)
                );
              }
            }
            if (this.gameObjects[j]?.getTag() === GameTag.SALMON_TAG) {
              this.gameObjects[j] = undefined;
              this.player.setPlayerSpeedConstant(10);
              setTimeout(() => this.player.setPlayerSpeedConstant(5), 5000);
            }
            if (this.gameObjects[j]?.getTag() === GameTag.CREAM_CHEESE_TAG) {
              this.gameObjects[j] = undefined;
              this.player.setPlayerSpeedConstant(2);
              setTimeout(() => this.player.setPlayerSpeedConstant(5), 5000);
            }
            if (
              this.gameObjects[j]?.getTag() === GameTag.SPREADING_TOOL_TAG &&
              p.getSpreadingToolCount() < MAX_SPREADING_TOOL_COUNT
            ) {
              this.gameObjects[j] = undefined;
              this.player.setSpreadingToolCount(this.player.getSpreadingToolCount() + 1);
            }
            if (this.gameObjects[j]?.getTag() === GameTag.TOASTER_GUN) {
              this.gameObjects[j] = undefined;
              if (this.player.getToastGunShotCount() < MAX_TOASTER_GUN_SHOT_COUNT) {
                this.player.setToasterGunShotCount(this.player.getToastGunShotCount() + 5);
              }
            }
          }
        }

        // Bagel collision logic
        if (this.gameObjects[i]?.getTag() === GameTag.BAGEL_TAG) {
          const b = this.gameObjects[i] as Bagel;
          if (prevLives != this.player.getLives()) b.setGameObjectToFollow(undefined);
          if (
            !b.getGameObjectToFollow() &&
            !b.isInRadius(this.gameObjects[j]!) &&
            b.isFollowableItem(this.gameObjects[j]?.getTag()!)
          ) {
            b.setGameObjectToFollow(this.gameObjects[j]!);
          }
          if (!b.isCollidingWith(this.gameObjects[j]!) && this.gameObjects[j]?.getTag() === GameTag.OFFICE_WORKER) {
            b.setGameObjectToFollow(undefined);
            const tempPosition = this.gameObjects[j]?.getPosition()!;
            this.gameObjects[j] = new Bagel(tempPosition, TILE_SIZE, TILE_SIZE, this.map);
          }
        }

        if (this.gameObjects[i]?.getTag() === GameTag.WIZARD_BOSS) {
          const boss = this.gameObjects[i] as WizardBoss;
          if (boss.getRelocationTimer() >= BOSS_RELOCATION_TIMER_CONST) {
            const { position } = generateSpawnCoordinates(this.map, this.rooms);
            boss.setPosition(new Vector2(position.x * TILE_SIZE, position.y * TILE_SIZE));
            boss.setRelocationTimer(0);
          }
        }
      }

      this.gameObjects[i]?.update(deltaTime);
    }

    if (
      this.map[Math.round(this.player.getPosition().y / TILE_SIZE)][
        Math.round(this.player.getPosition().x / TILE_SIZE)
      ] === TileMap.STAIRS
    ) {
      this.floorLevel += 1;

      if (this.floorLevel % 10 === 0) this.setupBossLevel();
      else this.setupDungeonLevel();
    }

    if (this.player.getLives() <= 0) {
      this.player.setLives(3);
      this.player.setAttackObjects([]);
      this.player.setToasterGunShotCount(5);
      this.floorLevel = 1;
      this.setupDungeonLevel();
    }

    if (this.boss.getHealth() <= 0) {
      this.onChangeScene(Scenes.CLOSING_SCENE);
      this.floorLevel += 1;
      this.boss.setPosition(Vector2.Zero());
      this.boss.setHealth(50);
    }

    if (this.currentLevelType === LevelType.BOSS_LEVEL) {
      if (this.randomSpawnTimer >= 1000) {
        const { position } = generateSpawnCoordinates(this.map, this.rooms);
        this.gameObjects.push(
          new ToasterGun(new Vector2(position.x * TILE_SIZE, position.y * TILE_SIZE), TILE_SIZE, TILE_SIZE)
        );
        this.randomSpawnTimer = 0;
      }

      this.randomSpawnTimer += 1;
    }

    for (let i = 0; i < this.player.getAttackObjects().length; i++) {
      const object = this.player.getAttackObjects()[i];
      if (!object) continue;
      if (!object.isCollidingWith(this.boss)) {
        this.player.removeAttackObject(i);
        this.boss.setHealth(this.boss.getHealth() - 5);
      }
      for (let j = 0; j < this.gameObjects.length; j++) {
        if (this.gameObjects[j]?.getTag() !== GameTag.BAGEL_TAG) continue;
        if (!object.isCollidingWith(this.gameObjects[j]!)) {
          this.gameObjects[j] = undefined;
          this.player.removeAttackObject(i);
        }
      }
    }

    for (let i = 0; i < this.boss.getAttackObjects().length; i++) {
      const object = this.boss.getAttackObjects()[i];
      if (!object) continue;

      object?.update(deltaTime);

      if (!object?.isCollidingWith(this.player)) {
        if (this.player.getSpreadingToolCount() > 0) {
          this.boss.removeAttackObject(i);
          this.player.setSpreadingToolCount(this.player.getSpreadingToolCount() - 1);
        } else {
          this.boss.removeAttackObject(i);
          this.player.setLives(this.player.getLives() - 1);
        }
      }

      if (!this.boss.getAttackObjects()[i]?.nearTarget()) {
        this.boss.removeAttackObject(i);
      }
    }

    this.camera.update(this.map);
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    for (let j = 0; j < this.map.length; j++) {
      for (let i = 0; i < this.map[j].length; i++) {
        if (
          !this.camera.isInRadius(
            new GameObject(GameTag.ROOM_TAG, new Vector2(i * TILE_SIZE, j * TILE_SIZE), TILE_SIZE, TILE_SIZE)
          )
        ) {
          ctx.drawImage(
            tileMap[this.map[j][i]],
            Math.round(i * TILE_SIZE - this.camera.getPosition().x),
            Math.round(j * TILE_SIZE - this.camera.getPosition().y),
            TILE_SIZE,
            TILE_SIZE
          );
        }
      }
    }

    for (let i = 0; i < this.gameObjects.length; i++) {
      if (this.gameObjects[i] != null && !this.camera.isInRadius(this.gameObjects[i]!))
        this.gameObjects[i]?.draw(ctx, this.camera);
    }

    for (let i = 0; i < this.boss.getAttackObjects().length; i++) {
      this.boss.getAttackObjects()[i]?.draw(ctx);
    }

    ctx.font = `60px Creepster`;
    ctx.fillStyle = "red";
    const floorText = this.floorLevel < 11 ? romanize(this.floorLevel).toString() : this.floorLevel.toString();
    ctx.fillText(floorText, 50, 65);
  }

  private setupBossLevel(): void {
    this.currentLevelType = LevelType.BOSS_LEVEL;

    this.map = this.generateMap(this.canvas.width, this.canvas.height);
    this.generateBossRoom();
    this.generateWalls();

    this.player.setWorldMap(this.map);
    this.player.setPosition(
      new Vector2(
        Math.floor(this.rooms[0].getWidth() * 0.75 * TILE_SIZE),
        Math.floor(this.rooms[0].getHeight() * 0.75 * TILE_SIZE)
      )
    );
    this.boss = this.spawnBoss();
    this.gameObjects = [this.player, this.boss];

    this.camera.setFollowedObject(undefined);
    this.camera.setPosition(Vector2.Zero());
  }

  private setupDungeonLevel(): void {
    this.currentLevelType = LevelType.DUNGEON_LEVEL;

    // Floor generation
    this.map = this.generateMap(this.canvas.width * 4, this.canvas.height * 4);
    this.generateRooms();

    this.grid = new Grid(this.map);
    for (let j = 0; j < this.map.length; j++) {
      for (let i = 0; i < this.map[0].length; i++) {
        this.grid.setWalkableAt(i, j, true);
      }
    }

    this.generateCorridors();
    this.generateWalls();
    this.generateStairs();

    // Entity creation
    this.spawnPlayer();
    this.bagels = this.spawnBagels();
    const npcs = this.spawnNPCs();
    const weaponsAndPowerUps = this.spawnWeaponsAndPowerUps();
    this.gameObjects = [this.player, ...this.bagels, ...weaponsAndPowerUps, ...npcs];

    // Set camera
    this.camera.setFollowedObject(this.player);
  }

  private generateMap(sizeX: number, sizeY: number): number[][] {
    let map: number[][] = [];
    for (let j = 0; j < Math.ceil(sizeY / TILE_SIZE); j++) {
      map.push([]);
      for (let i = 0; i < Math.ceil(sizeX / TILE_SIZE); i++) {
        map[j].push(TileMap.BLACK);
      }
    }
    return map;
  }

  private generateWalls(): void {
    for (let j = 0; j < this.map.length; j++) {
      for (let i = 0; i < this.map[j].length; i++) {
        if (this.map[j][i] !== 1) continue;
        if (
          this.map[j][i] === 0 ||
          (this.map[j][i + 1] >= 1 && this.map[j][i - 1] >= 1 && this.map[j + 1][i] >= 1 && this.map[j - 1][i] >= 1)
        ) {
          if (this.map[j - 1][i - 1] === 0) this.map[j][i] = TileMap.BOTTOM_RIGHT_WALL_INNER;
          if (this.map[j + 1][i + 1] === 0) this.map[j][i] = TileMap.TOP_LEFT_WALL_INNER;
          if (this.map[j + 1][i - 1] === 0) this.map[j][i] = TileMap.TOP_RIGHT_WALL_INNER;
          if (this.map[j - 1][i + 1] === 0) this.map[j][i] = TileMap.BOTTOM_LEFT_WALL_INNER;
        } else if (this.map[j][i - 1] === this.map[j - 1][i] && this.map[j + 1][i] >= 1 && this.map[j][i + 1] >= 1) {
          this.map[j][i] = TileMap.TOP_LEFT_WALL;
        } else if (this.map[j][i + 1] === this.map[j - 1][i] && this.map[j + 1][i] >= 1 && this.map[j][i - 1] >= 1) {
          this.map[j][i] = TileMap.TOP_RIGHT_WALL;
        } else if (this.map[j + 1][i] === this.map[j][i - 1] && this.map[j - 1][i] >= 1 && this.map[j][i + 1] >= 1) {
          this.map[j][i] = TileMap.BOTTOM_LEFT_WALL;
        } else if (this.map[j + 1][i] === this.map[j][i + 1] && this.map[j - 1][i] >= 1 && this.map[j][i - 1] >= 1) {
          this.map[j][i] = TileMap.BOTTOM_RIGHT_WALL;
        } else if (
          this.map[j - 1][i] === 0 &&
          this.map[j + 1][i] >= 1 &&
          this.map[j][i - 1] >= 1 &&
          this.map[j][i + 1] >= 1
        ) {
          this.map[j][i] = TileMap.TOP_WALL;
        } else if (
          this.map[j + 1][i] === 0 &&
          this.map[j - 1][i] >= 1 &&
          this.map[j][i - 1] >= 1 &&
          this.map[j][i + 1] >= 1
        ) {
          this.map[j][i] = TileMap.BOTTOM_WALL;
        } else if (
          this.map[j][i - 1] === 0 &&
          this.map[j][i + 1] >= 1 &&
          this.map[j + 1][i] >= 1 &&
          this.map[j - 1][i] >= 1
        ) {
          this.map[j][i] = TileMap.LEFT_WALL;
        } else if (
          this.map[j][i + 1] === 0 &&
          this.map[j][i - 1] >= 1 &&
          this.map[j + 1][i] >= 1 &&
          this.map[j - 1][i] >= 1
        ) {
          this.map[j][i] = TileMap.RIGHT_WALL;
        } else {
          this.map[j][i] = TileMap.BLACK;
        }
      }
    }
  }

  private generateBossRoom(): void {
    const startX = Math.floor(this.map[0].length / 8);
    const startY = Math.floor(this.map.length / 8);
    const roomWidth = Math.floor(this.map[0].length * 0.9);
    const roomHeight = Math.floor(this.map.length * 0.9);
    const room = new Room(new Vector2(startX, startY), roomWidth, roomHeight);
    this.rooms = [room];
    for (let j = startY; j < roomHeight; j++) {
      for (let i = startX; i < roomWidth; i++) {
        this.map[j][i] = TileMap.FLOOR;
      }
    }
  }

  private generateRooms(): void {
    let attempts = 0;
    const rooms: Room[] = [];
    while (rooms.length < MAX_ROOM_COUNT && attempts < MAX_ROOM_GEN_ATTEMPTS_COUNT) {
      const x = Math.floor(getRandomArbitrary(1, this.map[0].length - 1 - MAX_ROOM_WIDTH));
      const y = Math.floor(getRandomArbitrary(1, this.map.length - 1 - MAX_ROOM_HEIGHT));
      const width = Math.floor(getRandomArbitrary(MIN_ROOM_WIDTH, MAX_ROOM_WIDTH));
      const height = Math.floor(getRandomArbitrary(MIN_ROOM_HEIGHT, MAX_ROOM_HEIGHT));
      const room = new Room(new Vector2(x, y), width, height);
      if (!rooms.some((r) => !room.isInRadius(r))) {
        rooms.push(room);
        attempts = 0;
      }
      attempts++;
    }
    this.rooms = rooms;
    for (let i = 0; i < rooms.length; i++) {
      for (let j = rooms[i].getPosition().y; j < rooms[i].getBottom(); j++) {
        for (let k = rooms[i].getPosition().x; k < rooms[i].getRight(); k++) {
          this.map[j][k] = TileMap.FLOOR;
        }
      }
    }
  }

  private generateCorridors(): void {
    const paths: Vector2[][] = [];
    let curr = 0;
    while (curr != this.rooms.length - 1) {
      const currentCenter = this.rooms[curr].getCenter();
      const nextCenter = this.rooms[curr + 1].getCenter();
      const path = pathfinder
        .findPath(currentCenter.x, currentCenter.y, nextCenter.x, nextCenter.y, this.grid.clone())
        .map((vector) => new Vector2(vector[0], vector[1]));
      paths.push(path);
      curr += 1;
    }
    for (let j = 0; j < paths.length; j++) {
      for (let i = 0; i < paths[j].length; i++) {
        this.map[paths[j][i].y][paths[j][i].x] = 1;
        this.map[paths[j][i].y + 1][paths[j][i].x] = 1;
        this.map[paths[j][i].y - 1][paths[j][i].x] = 1;
        this.map[paths[j][i].y + 2][paths[j][i].x] = 1;
        this.map[paths[j][i].y - 2][paths[j][i].x] = 1;
        this.map[paths[j][i].y + 3][paths[j][i].x] = 1;
        this.map[paths[j][i].y - 3][paths[j][i].x] = 1;
        this.map[paths[j][i].y][paths[j][i].x + 1] = 1;
        this.map[paths[j][i].y][paths[j][i].x - 1] = 1;
        this.map[paths[j][i].y][paths[j][i].x + 2] = 1;
        this.map[paths[j][i].y][paths[j][i].x - 2] = 1;
        this.map[paths[j][i].y][paths[j][i].x + 3] = 1;
        this.map[paths[j][i].y][paths[j][i].x - 3] = 1;
      }
    }
  }

  private generateStairs(): void {
    const { position, room } = generateSpawnCoordinates(this.map, this.rooms);
    this.map[position.y][position.x] = TileMap.STAIRS;
    room.setHasStairs(true);
  }

  private spawnPlayer(): void {
    const { position, room } = generateSpawnCoordinates(this.map, this.rooms);
    this.playerInitialSpawn = position;
    this.map[position.y][position.x] = TileMap.PLAYER;
    room.setHasPlayer(true);
    this.player.setWorldMap(this.map);
    this.player.setPosition(new Vector2(position.x * TILE_SIZE, position.y * TILE_SIZE));
  }

  private spawnBagels(): Bagel[] {
    let attempts = 0;
    const bagels: Bagel[] = [];
    while (bagels.length < MAX_BAGEL_COUNT && attempts < 10) {
      const { position, room } = generateSpawnCoordinates(this.map, this.rooms);
      if (!room.getHasPlayer() && !room.getHasStairs()) {
        room.setHasBagels(true);
        this.map[position.y][position.x] = TileMap.BAGEL;
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
    const randoms = [TileMap.SALMON, TileMap.SPREADING_TOOL, TileMap.TOASTER_GUN, TileMap.CREAM_CHEESE];
    for (let i = 0; i < MAX_POWER_UPS_PER_FLOOR; i++) {
      const randomIndex = Math.round(getRandomArbitrary(0, randoms.length - 1));
      const { position } = generateSpawnCoordinates(this.map, this.rooms);
      this.map[position.y][position.x] = randoms[randomIndex];
      if (randoms[randomIndex] === TileMap.SALMON) {
        objects.push(new Salmon(new Vector2(position.x * TILE_SIZE, position.y * TILE_SIZE), TILE_SIZE, TILE_SIZE));
      } else if (randoms[randomIndex] === TileMap.TOASTER_GUN) {
        objects.push(new ToasterGun(new Vector2(position.x * TILE_SIZE, position.y * TILE_SIZE), TILE_SIZE, TILE_SIZE));
      } else if (randoms[randomIndex] === TileMap.CREAM_CHEESE) {
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

  private spawnBoss(): WizardBoss {
    const { position } = generateSpawnCoordinates(this.map, this.rooms);
    this.map[position.y][position.x] = TileMap.BOSS;
    return new WizardBoss(
      new Vector2(position.x * TILE_SIZE, position.y * TILE_SIZE),
      TILE_SIZE,
      TILE_SIZE,
      this.player
    );
  }

  private spawnNPCs(): OfficeWorker[] {
    let attempts = 0;
    const workers: OfficeWorker[] = [];
    while (workers.length < MAX_OFFICE_WORKERS_PER_FLOOR && attempts < 10) {
      const { position } = generateSpawnCoordinates(this.map, this.rooms);
      this.map[position.y][position.x] = TileMap.OFFICE_WORKER;
      workers.push(
        new OfficeWorker(new Vector2(position.x * TILE_SIZE, position.y * TILE_SIZE), TILE_SIZE, TILE_SIZE, this.map)
      );
      attempts = 0;
    }
    return workers;
  }
}

export default Game;
