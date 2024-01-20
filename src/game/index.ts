import CarpetImage from "../assets/images/floor-carpet.png";
import BlackImage from "../assets/images/black.png";
import StairsImage from "../assets/images/stairs.png";
import TopLeftWallImage from "../assets/images/top-left-wall.png";
import TopLeftInnerWallImage from "../assets/images/top-left-inner-wall.png";
import TopWallImage from "../assets/images/top-wall.png";
import TopRightWallImage from "../assets/images/top-right-wall.png";
import TopRightInnerWallImage from "../assets/images/top-right-inner-wall.png";
import RightWallImage from "../assets/images/right-wall.png";
import BottomRightWallImage from "../assets/images/bottom-right-wall.png";
import BottomWallImage from "../assets/images/bottom-wall.png";
import BottomLeftWallImage from "../assets/images/bottom-left-wall.png";
import BottomLeftInnerWallImage from "../assets/images/bottom-left-inner-wall.png";
import LeftWallImage from "../assets/images/left-wall.png";
import BottomRightInnerWallImage from "../assets/images/bottom-right-inner-wall.png";
import { getRandomArbitrary } from "../helpers";
import { Room } from "./entities/room";
import {
  GameTags,
  MAX_BAGEL_COUNT,
  MAX_ROOM_COUNT,
  MAX_ROOM_GEN_ATTEMPTS_COUNT,
  MAX_ROOM_HEIGHT,
  MAX_ROOM_WIDTH,
  MAX_SPREADING_TOOL_COUNT,
  MAX_TOASTER_GUN_SHOT_COUNT,
  MIN_ROOM_HEIGHT,
  MIN_ROOM_WIDTH,
  TILE_SIZE
} from "../constants";
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

const tileMap: Record<number, HTMLImageElement> = {
  0: blackSprite,
  1: floorSprite,
  2: stairsSprite,
  3: floorSprite, // Player location
  4: floorSprite, // Bagel location
  5: topLeftWallSprite, // Wall location
  6: floorSprite, // Salmon location
  7: floorSprite, // Spreading tool location
  8: topWallSprite,
  9: topRightWallSprite,
  10: rightWallSprite,
  11: bottomRightWallSprite,
  12: bottomWallSprite,
  13: bottomLeftWallSprite,
  14: leftWallSprite,
  15: bottomRightInnerWallSprite,
  16: topLeftInnerWallSprite,
  17: topRightInnerWallSprite,
  18: bottomLeftInnerWallSprite,
  19: floorSprite,
  20: floorSprite, // Boss location
  21: floorSprite // Cream cheese location
};

const entityConstants = [2, 3, 4, 6, 7, 20];

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

class Game {
  private canvas: HTMLCanvasElement;
  private camera: Camera;
  private player: Player;
  private boss: WizardBoss;
  private playerInitialSpawn: Vector2;
  private bagels: Bagel[];
  private map: number[][];
  private rooms: Room[];
  private gameObjects: Array<GameObject | undefined>;
  private floorLevel: number;

  constructor(canvas: HTMLCanvasElement) {
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
    this.setupDungeonLevel();
  }

  public update(deltaTime: number): void {
    const prevLives = this.player.getLives();
    for (let i = 0; i < this.gameObjects.length; i++) {
      for (let j = 0; j < this.gameObjects.length; j++) {
        if (this.gameObjects[i] == null || this.gameObjects[j] == null || this.gameObjects[i] === this.gameObjects[j])
          continue;

        // Player collision logic
        if (this.gameObjects[i]?.getTag() === GameTags.PLAYER_TAG) {
          const p = this.gameObjects[i] as Player;
          if (!p.isCollidingWith(this.gameObjects[j]!)) {
            if (this.gameObjects[j]?.getTag() === GameTags.BAGEL_TAG) {
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
            if (this.gameObjects[j]?.getTag() === GameTags.SALMON_TAG) {
              this.gameObjects[j] = undefined;
              this.player.setPlayerSpeedConstant(10);
              setTimeout(() => this.player.setPlayerSpeedConstant(5), 5000);
            }
            if (this.gameObjects[j]?.getTag() === GameTags.CREAM_CHEESE_TAG) {
              this.gameObjects[j] = undefined;
              this.player.setPlayerSpeedConstant(2);
              setTimeout(() => this.player.setPlayerSpeedConstant(5), 5000);
            }
            if (
              this.gameObjects[j]?.getTag() === GameTags.SPREADING_TOOL_TAG &&
              p.getSpreadingToolCount() < MAX_SPREADING_TOOL_COUNT
            ) {
              this.gameObjects[j] = undefined;
              this.player.setSpreadingToolCount(this.player.getSpreadingToolCount() + 1);
            }
            if (this.gameObjects[j]?.getTag() === GameTags.TOASTER_GUN) {
              this.gameObjects[j] = undefined;
              console.log(this.player.getToastGunShotCount(), MAX_TOASTER_GUN_SHOT_COUNT);
              if (this.player.getToastGunShotCount() < MAX_TOASTER_GUN_SHOT_COUNT) {
                this.player.setToasterGunShotCount(this.player.getToastGunShotCount() + 5);
              }
            }
          }
        }

        // Bagel collision logic
        if (this.gameObjects[i]?.getTag() === GameTags.BAGEL_TAG) {
          const b = this.gameObjects[i] as Bagel;
          if (prevLives != this.player.getLives()) b.setGameObjectToFollow(undefined);
          if (
            !b.getGameObjectToFollow() &&
            !b.isInRadius(this.gameObjects[j]!) &&
            b.isFollowableItem(this.gameObjects[j]?.getTag()!)
          ) {
            b.setGameObjectToFollow(this.gameObjects[j]!);
          }
        }

        if (this.gameObjects[i]?.getTag() === GameTags.WIZARD_BOSS) {
          const boss = this.gameObjects[i] as WizardBoss;
          if (boss.getRelocationTimer() >= 250) {
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
      ] === 2
    ) {
      this.floorLevel += 1;

      if (this.floorLevel % 15 === 0) this.setupBossLevel();
      else this.setupDungeonLevel();
    }

    if (this.player.getLives() <= 0) {
      this.player.setLives(3);
      this.floorLevel = 1;
      this.setupDungeonLevel();
    }

    if (this.boss.getHealth() <= 0) {
      this.setupDungeonLevel();
      this.floorLevel += 1;
      this.boss.setPosition(Vector2.Zero());
      this.boss.setHealth(50);
    }

    for (let i = 0; i < this.player.getAttackObjects().length; i++) {
      const object = this.player.getAttackObjects()[i];
      if (!object) continue;
      if (!object.isCollidingWith(this.boss)) {
        this.player.removeAttackObject(i);
        this.boss.setHealth(this.boss.getHealth() - 5);
      }
      for (let j = 0; j < this.gameObjects.length; j++) {
        if (this.gameObjects[j]?.getTag() !== GameTags.BAGEL_TAG) continue;
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
            new GameObject(GameTags.ROOM_TAG, new Vector2(i * TILE_SIZE, j * TILE_SIZE), TILE_SIZE, TILE_SIZE)
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

    ctx.font = `40px Verdana`;
    ctx.fillStyle = "red";
    ctx.fillText(`Floor: ${this.floorLevel.toString()}`, 50, 50);
  }

  private setupBossLevel(): void {
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
    // Floor generation
    this.map = this.generateMap(this.canvas.width * 4, this.canvas.height * 4);
    this.generateRooms();
    this.generateCorridors();
    this.generateWalls();
    this.generateStairs();

    // Entity creation
    this.spawnPlayer();
    this.bagels = this.spawnBagels();
    const weaponsAndPowerUps = this.spawnWeaponsAndPowerUps();
    this.gameObjects = [this.player, ...this.bagels, ...weaponsAndPowerUps];

    // Set camera
    this.camera.setFollowedObject(this.player);
  }

  private generateMap(sizeX: number, sizeY: number): number[][] {
    let map: number[][] = [];
    for (let j = 0; j < Math.ceil(sizeY / TILE_SIZE); j++) {
      map.push([]);
      for (let i = 0; i < Math.ceil(sizeX / TILE_SIZE); i++) {
        map[j].push(0);
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
          if (this.map[j - 1][i - 1] === 0) this.map[j][i] = 15;
          if (this.map[j + 1][i + 1] === 0) this.map[j][i] = 16;
          if (this.map[j + 1][i - 1] === 0) this.map[j][i] = 17;
          if (this.map[j - 1][i + 1] === 0) this.map[j][i] = 18;
        } else if (this.map[j][i - 1] === this.map[j - 1][i] && this.map[j + 1][i] >= 1 && this.map[j][i + 1] >= 1) {
          this.map[j][i] = 5;
        } else if (this.map[j][i + 1] === this.map[j - 1][i] && this.map[j + 1][i] >= 1 && this.map[j][i - 1] >= 1) {
          this.map[j][i] = 9;
        } else if (this.map[j + 1][i] === this.map[j][i - 1] && this.map[j - 1][i] >= 1 && this.map[j][i + 1] >= 1) {
          this.map[j][i] = 13;
        } else if (this.map[j + 1][i] === this.map[j][i + 1] && this.map[j - 1][i] >= 1 && this.map[j][i - 1] >= 1) {
          this.map[j][i] = 11;
        } else if (
          this.map[j - 1][i] === 0 &&
          this.map[j + 1][i] >= 1 &&
          this.map[j][i - 1] >= 1 &&
          this.map[j][i + 1] >= 1
        ) {
          this.map[j][i] = 8;
        } else if (
          this.map[j + 1][i] === 0 &&
          this.map[j - 1][i] >= 1 &&
          this.map[j][i - 1] >= 1 &&
          this.map[j][i + 1] >= 1
        ) {
          this.map[j][i] = 12;
        } else if (
          this.map[j][i - 1] === 0 &&
          this.map[j][i + 1] >= 1 &&
          this.map[j + 1][i] >= 1 &&
          this.map[j - 1][i] >= 1
        ) {
          this.map[j][i] = 14;
        } else if (
          this.map[j][i + 1] === 0 &&
          this.map[j][i - 1] >= 1 &&
          this.map[j + 1][i] >= 1 &&
          this.map[j - 1][i] >= 1
        ) {
          this.map[j][i] = 10;
        } else {
          this.map[j][i] = 0;
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
        this.map[j][i] = 1;
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
          this.map[j][k] = 1;
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
      const path = this.generatePath(currentCenter, nextCenter);
      paths.push(path);
      curr += 1;
    }
    for (let j = 0; j < paths.length; j++) {
      for (let i = 0; i < paths[j].length; i++) {
        this.map[paths[j][i].y][paths[j][i].x] = 1;
      }
    }
  }

  private generatePath(currentCenter: Vector2, nextCenter: Vector2): Vector2[] {
    const path: Vector2[] = [];
    const corridorSize = 4;
    let diffX = currentCenter.x - nextCenter.x;
    let diffY = currentCenter.y - nextCenter.y;
    for (let i = 0; i < corridorSize; i++) {
      for (let j = 0; j < Math.abs(diffX); j++) {
        let currentTile: Vector2;
        if (diffX > 0) currentTile = new Vector2(currentCenter.x - j, currentCenter.y + i);
        else currentTile = new Vector2(currentCenter.x + j, currentCenter.y + i);
        path.push(currentTile);
      }
    }
    for (let i = 0; i < corridorSize; i++) {
      for (let j = 0; j < Math.abs(diffY); j++) {
        let currentTile: Vector2;
        if (diffY > 0) currentTile = new Vector2(nextCenter.x + i, currentCenter.y - j);
        else currentTile = new Vector2(nextCenter.x + i, currentCenter.y + j);
        path.push(currentTile);
      }
    }
    return path;
  }

  private generateStairs(): void {
    const { position, room } = generateSpawnCoordinates(this.map, this.rooms);
    this.map[position.y][position.x] = 2;
    room.setHasStairs(true);
  }

  private spawnPlayer(): void {
    const { position, room } = generateSpawnCoordinates(this.map, this.rooms);
    this.playerInitialSpawn = position;
    this.map[position.y][position.x] = 3;
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
        this.map[position.y][position.x] = 4;
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

  private spawnBoss(): WizardBoss {
    const { position } = generateSpawnCoordinates(this.map, this.rooms);
    this.map[position.y][position.x] = 19;
    return new WizardBoss(
      new Vector2(position.x * TILE_SIZE, position.y * TILE_SIZE),
      TILE_SIZE,
      TILE_SIZE,
      this.player
    );
  }
}

export default Game;
