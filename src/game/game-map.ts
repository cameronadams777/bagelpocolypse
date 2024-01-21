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
import { GameTags, MAX_ROOM_COUNT, MAX_ROOM_GEN_ATTEMPTS_COUNT, MAX_ROOM_HEIGHT, MAX_ROOM_WIDTH, MIN_ROOM_HEIGHT, MIN_ROOM_WIDTH, TILE_SIZE } from "../constants";
import { getRandomArbitrary } from "../helpers";
import { Room } from "./entities/room";
import Vector2 from "./math/vector2";
import Camera from "./entities/camera";
import GameObject from "./entities/game-object";

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

class GameMap {
  private tiles: number[][];
  private rooms: Room[];
  constructor() {
    this.tiles = [];
    this.rooms = [];
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    for (let j = 0; j < this.tiles.length; j++) {
      for (let i = 0; i < this.tiles[j].length; i++) {
        if (
          !camera.isInRadius(
            new GameObject(GameTags.ROOM_TAG, new Vector2(i * TILE_SIZE, j * TILE_SIZE), TILE_SIZE, TILE_SIZE)
          )
        ) {
          ctx.drawImage(
            tileMap[this.tiles[j][i]],
            Math.round(i * TILE_SIZE - camera.getPosition().x),
            Math.round(j * TILE_SIZE - camera.getPosition().y),
            TILE_SIZE,
            TILE_SIZE
          );
        }
      }
    }
  }

  public getRooms(): Room[] {
    return this.rooms;
  }

  public createBossMap(): void {
    this.tiles = this.generateTileMap(this.canvas.width, this.canvas.height);
    this.generateBossRoom();
    this.generateWalls();
  }

  public createDungeonMap(): void {
    this.tiles = this.generateTileMap(this.canvas.width * 4, this.canvas.height * 4);
    this.generateRooms();
    this.generateCorridors();
    this.generateWalls();
  }

  private generateTileMap(sizeX: number, sizeY: number): number[][] {
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
    for (let j = 0; j < this.tiles.length; j++) {
      for (let i = 0; i < this.tiles[j].length; i++) {
        if (this.tiles[j][i] !== 1) continue;
        if (
          this.tiles[j][i] === 0 ||
          (this.tiles[j][i + 1] >= 1 && this.tiles[j][i - 1] >= 1 && this.tiles[j + 1][i] >= 1 && this.tiles[j - 1][i] >= 1)
        ) {
          if (this.tiles[j - 1][i - 1] === 0) this.tiles[j][i] = 15;
          if (this.tiles[j + 1][i + 1] === 0) this.tiles[j][i] = 16;
          if (this.tiles[j + 1][i - 1] === 0) this.tiles[j][i] = 17;
          if (this.tiles[j - 1][i + 1] === 0) this.tiles[j][i] = 18;
        } else if (this.tiles[j][i - 1] === this.tiles[j - 1][i] && this.tiles[j + 1][i] >= 1 && this.tiles[j][i + 1] >= 1) {
          this.tiles[j][i] = 5;
        } else if (this.tiles[j][i + 1] === this.tiles[j - 1][i] && this.tiles[j + 1][i] >= 1 && this.tiles[j][i - 1] >= 1) {
          this.tiles[j][i] = 9;
        } else if (this.tiles[j + 1][i] === this.tiles[j][i - 1] && this.tiles[j - 1][i] >= 1 && this.tiles[j][i + 1] >= 1) {
          this.tiles[j][i] = 13;
        } else if (this.tiles[j + 1][i] === this.tiles[j][i + 1] && this.tiles[j - 1][i] >= 1 && this.tiles[j][i - 1] >= 1) {
          this.tiles[j][i] = 11;
        } else if (
          this.tiles[j - 1][i] === 0 &&
          this.tiles[j + 1][i] >= 1 &&
          this.tiles[j][i - 1] >= 1 &&
          this.tiles[j][i + 1] >= 1
        ) {
          this.tiles[j][i] = 8;
        } else if (
          this.tiles[j + 1][i] === 0 &&
          this.tiles[j - 1][i] >= 1 &&
          this.tiles[j][i - 1] >= 1 &&
          this.tiles[j][i + 1] >= 1
        ) {
          this.tiles[j][i] = 12;
        } else if (
          this.tiles[j][i - 1] === 0 &&
          this.tiles[j][i + 1] >= 1 &&
          this.tiles[j + 1][i] >= 1 &&
          this.tiles[j - 1][i] >= 1
        ) {
          this.tiles[j][i] = 14;
        } else if (
          this.tiles[j][i + 1] === 0 &&
          this.tiles[j][i - 1] >= 1 &&
          this.tiles[j + 1][i] >= 1 &&
          this.tiles[j - 1][i] >= 1
        ) {
          this.tiles[j][i] = 10;
        } else {
          this.tiles[j][i] = 0;
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
        this.tiles[paths[j][i].y][paths[j][i].x] = 1;
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

  private generateBossRoom(): void {
    const startX = Math.floor(this.tiles[0].length / 8);
    const startY = Math.floor(this.tiles.length / 8);
    const roomWidth = Math.floor(this.tiles[0].length * 0.9);
    const roomHeight = Math.floor(this.tiles.length * 0.9);
    const room = new Room(new Vector2(startX, startY), roomWidth, roomHeight);
    this.rooms = [room];
    for (let j = startY; j < roomHeight; j++) {
      for (let i = startX; i < roomWidth; i++) {
        this.tiles[j][i] = 1;
      }
    }
  }

  private generateRooms(): void {
    let attempts = 0;
    const rooms: Room[] = [];
    while (rooms.length < MAX_ROOM_COUNT && attempts < MAX_ROOM_GEN_ATTEMPTS_COUNT) {
      const x = Math.floor(getRandomArbitrary(1, this.tiles[0].length - 1 - MAX_ROOM_WIDTH));
      const y = Math.floor(getRandomArbitrary(1, this.tiles.length - 1 - MAX_ROOM_HEIGHT));
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
          this.tiles[j][k] = 1;
        }
      }
    }
  }
}



export default GameMap;
