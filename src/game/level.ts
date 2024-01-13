import ConcreteImage from "../assets/images/concrete.png";
import BlackImage from "../assets/images/black.png";
import StairsImage from "../assets/images/stairs.png";
import StoneImage from "../assets/images/stone.png";
import { getRandomArbitrary } from "../helpers";
import { Room } from "./entities/room";
import {
  GameTags,
  MAX_ROOM_COUNT,
  MAX_ROOM_GEN_ATTEMPTS_COUNT,
  MAX_ROOM_HEIGHT,
  MAX_ROOM_WIDTH,
  MIN_ROOM_HEIGHT,
  MIN_ROOM_WIDTH,
  TILE_SIZE
} from "../constants";
import Player from "./entities/player";
import Bagel from "./entities/bagel";
import GameObject from "./entities/game-object";
import Vector2 from "./math/vector2";
import Camera from "./entities/camera";

const stairsSprite = new Image();
stairsSprite.src = StairsImage;

const concreteSprite = new Image();
concreteSprite.src = ConcreteImage;

const stoneSprite = new Image();
stoneSprite.src = StoneImage;

const blackSprite = new Image();
blackSprite.src = BlackImage;

const tileMap: Record<number, HTMLImageElement> = {
  0: blackSprite,
  1: concreteSprite,
  2: stairsSprite,
  3: concreteSprite, // Player location
  4: concreteSprite, // Bagel location
  5: stoneSprite // Wall location
};

const entityConstants = [2, 3, 4];

const generateSpawnCoordinates = (map: number[][], rooms: Room[]): Vector2 => {
  const randRoom = rooms[getRandomArbitrary(0, rooms.length - 1)];
  let randPosition: Vector2 | undefined;
  while (randPosition == null || entityConstants.includes(map[randPosition.y][randPosition.x])) {
    randPosition = new Vector2(
      getRandomArbitrary(randRoom.getPosition().x + 1, randRoom.getRight() - 1),
      getRandomArbitrary(randRoom.getPosition().y + 1, randRoom.getBottom() - 1)
    );
  }
  return randPosition;
};

class Level {
  private camera: Camera;
  private player: Player;
  private playerInitialSpawn: Vector2;
  private bagels: Bagel[];
  private map: number[][];
  private rooms: Room[];
  private gameObjects: Array<GameObject | undefined>;

  constructor(canvas: HTMLCanvasElement) {
    this.camera = new Camera(GameTags.CAMERA_TAG, Vector2.Zero(), 1, 1);
    this.map = [];
    this.rooms = [];
    this.bagels = [];
    this.gameObjects = [];
    this.playerInitialSpawn = Vector2.Zero();
    this.setupLevel(canvas);
  }

  public update(): void {
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
              p.setLives(p.getLives() - 1);
              p.setPosition(new Vector2(this.playerInitialSpawn.x * TILE_SIZE, this.playerInitialSpawn.y * TILE_SIZE));
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
          }
        }

        if (this.gameObjects[i]?.getTag() === GameTags.BAGEL_TAG) {
          const b = this.gameObjects[i] as Bagel;
          if (prevLives != this.player.getLives()) b.setGameObjectToFollow(undefined);
          if (
            !b.getGameObjectToFollow() &&
            !b.isInRadius(this.gameObjects[j]!) &&
            b.isFollowableItem(this.gameObjects[j]?.getTag()!)
          ) {
            b.setState("following");
            b.setGameObjectToFollow(this.gameObjects[j]!);
          }
        }
      }

      this.gameObjects[i]?.update();
    }

    this.camera.update();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    for (let j = 0; j < this.map.length; j++) {
      for (let i = 0; i < this.map[j].length; i++) {
        ctx.drawImage(tileMap[this.map[j][i]], i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }

    for (let i = 0; i < this.gameObjects.length; i++) this.gameObjects[i]?.draw(ctx);
  }

  private setupLevel(canvas: HTMLCanvasElement): void {
    // Floor generation
    this.map = this.generateMap(canvas);
    this.generateRooms();
    this.generateCorridors();
    this.generateWalls();
    this.generateStairs();

    // Entity creation
    this.player = this.spawnPlayer();
    this.bagels = this.spawnBagels();
    this.gameObjects = [this.player, ...this.bagels];

    // Set camera
    this.camera.setFollowedObject(this.player);
  }

  private generateMap(canvas: HTMLCanvasElement): number[][] {
    let map: number[][] = [];
    for (let j = 0; j < Math.ceil(canvas.height / TILE_SIZE); j++) {
      map.push([]);
      for (let i = 0; i < Math.ceil(canvas.width / TILE_SIZE); i++) {
        map[j].push(0);
      }
    }
    return map;
  }

  private generateWalls(): void {
    for (let j = 0; j < this.map.length; j++) {
      for (let i = 0; i < this.map[j].length; i++) {
        if (this.map[j][i] !== 1) continue;
        if (this.map?.[j - 1]?.[i - 1] === 0) {
          this.map[j][i] = 5;
        } else if (this.map?.[j - 1]?.[i] === 0) {
          this.map[j][i] = 5;
        } else if (this.map?.[j - 1]?.[i + 1] === 0) {
          this.map[j][i] = 5;
        } else if (this.map?.[j]?.[i + 1] === 0) {
          this.map[j][i] = 5;
        } else if (this.map?.[j + 1]?.[i + 1] === 0) {
          this.map[j][i] = 5;
        } else if (this.map?.[j + 1]?.[i] === 0) {
          this.map[j][i] = 5;
        } else if (this.map?.[j + 1]?.[i - 1] === 0) {
          this.map[j][i] = 5;
        } else if (this.map?.[j]?.[i - 1] === 0) {
          this.map[j][i] = 5;
        }
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
      const room = new Room(GameTags.ROOM_TAG, new Vector2(x, y), width, height);
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
    let attempts = 0;
    while (curr != this.rooms.length - 1 && attempts < 10) {
      const currentCenter = this.rooms[curr].getCenter();
      const nextCenter = this.rooms[curr + 1].getCenter();
      const path = this.generatePath(currentCenter, nextCenter);
      paths.push(path);
      curr += 1;
      attempts += 1;
    }
    for (let j = 0; j < paths.length; j++) {
      for (let i = 0; i < paths[j].length; i++) {
        this.map[paths[j][i].y][paths[j][i].x] = 1;
      }
    }
  }

  private generatePath(currentCenter: Vector2, nextCenter: Vector2): Vector2[] {
    const path: Vector2[] = [];
    let diffX = currentCenter.x - nextCenter.x;
    let diffY = currentCenter.y - nextCenter.y;
    for (let i = 0; i < Math.abs(diffX); i++) {
      let currentTile: Vector2;
      if (diffX > 0) currentTile = new Vector2(currentCenter.x - i, currentCenter.y);
      else currentTile = new Vector2(currentCenter.x + i, currentCenter.y);
      path.push(currentTile);
    }
    for (let i = 0; i < Math.abs(diffX); i++) {
      let currentTile: Vector2;
      if (diffX > 0) currentTile = new Vector2(currentCenter.x - i, currentCenter.y + 1);
      else currentTile = new Vector2(currentCenter.x + i, currentCenter.y + 1);
      path.push(currentTile);
    }
    for (let i = 0; i < Math.abs(diffY); i++) {
      let currentTile: Vector2;
      if (diffY > 0) currentTile = new Vector2(nextCenter.x, currentCenter.y - 1);
      else currentTile = new Vector2(nextCenter.x, currentCenter.y + i);
      path.push(currentTile);
    }
    return path;
  }

  private generateStairs(): void {
    const { x, y } = generateSpawnCoordinates(this.map, this.rooms);
    this.map[y][x] = 2;
  }

  private spawnPlayer(): Player {
    const spawnPosition = generateSpawnCoordinates(this.map, this.rooms);
    this.playerInitialSpawn = spawnPosition;
    this.map[spawnPosition.y][spawnPosition.x] = 3;
    return new Player(
      GameTags.PLAYER_TAG,
      new Vector2(spawnPosition.x * TILE_SIZE, spawnPosition.y * TILE_SIZE),
      TILE_SIZE,
      TILE_SIZE
    );
  }

  private spawnBagels(): Bagel[] {
    const bagels: Bagel[] = [];
    for (let i = 0; i < 3; i++) {
      const spawnPosition = generateSpawnCoordinates(this.map, this.rooms);
      bagels.push(
        new Bagel(
          GameTags.BAGEL_TAG,
          new Vector2(spawnPosition.x * TILE_SIZE, spawnPosition.y * TILE_SIZE),
          TILE_SIZE,
          TILE_SIZE
        )
      );
    }
    return bagels;
  }
}

export default Level;
