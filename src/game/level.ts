import ConcreteImage from "../assets/images/concrete.png";
import StoneImage from "../assets/images/stone.png";
import StairsImage from "../assets/images/stairs.png";
import { getRandomArbitrary } from "../helpers";
import { Room } from "./room";

const stairsSprite = new Image();
stairsSprite.src = StairsImage;

const concreteSprite = new Image();
concreteSprite.src = ConcreteImage;

const floorSprite = new Image();
floorSprite.src = StoneImage;

const TILE_SIZE = 32;
const MIN_ROOM_WIDTH = 10;
const MIN_ROOM_HEIGHT = 10;
const MAX_ROOM_WIDTH = 20;
const MAX_ROOM_HEIGHT = 20;
const MAX_ROOM_COUNT = 3;
const MAX_ROOM_GEN_ATTEMPTS_COUNT = 10;
const ROOM_TAG = "room";

const tileMap: Record<number, HTMLImageElement> = {
  0: floorSprite,
  1: concreteSprite,
  2: stairsSprite,
}

class Level {
  private map: number[][];
  private rooms: Room[];

  constructor(canvas: HTMLCanvasElement) {
    this.map = this.generateMap(canvas);
    this.rooms = [];
    this.generateRooms();
    this.generateStairs();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    for(let j = 0; j < this.map.length; j++) {
      for(let i = 0; i < this.map[j].length; i++) {
        ctx.drawImage(tileMap[this.map[j][i]], i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  private generateMap(canvas: HTMLCanvasElement): number[][]{
    let map: number[][] = [];
    for (let j = 0; j < Math.ceil(canvas.height / TILE_SIZE); j++) {
      map.push([]);
      for (let i = 0; i < Math.ceil(canvas.width / TILE_SIZE); i++) {
        map[j].push(0);
      }
    }
    return map;
  }

  private generateRooms(): void {
    let attempts = 0;
    const rooms: Room[] = [];
    while(rooms.length < MAX_ROOM_COUNT && attempts < MAX_ROOM_GEN_ATTEMPTS_COUNT) {
      const x = Math.floor(getRandomArbitrary(1, (this.map[0].length - 1) - MAX_ROOM_WIDTH));
      const y = Math.floor(getRandomArbitrary(1, (this.map.length - 1) - MAX_ROOM_HEIGHT));
      const width = Math.floor(getRandomArbitrary(MIN_ROOM_WIDTH, MAX_ROOM_WIDTH));
      const height = Math.floor(getRandomArbitrary(MIN_ROOM_HEIGHT, MAX_ROOM_HEIGHT));
      const room = new Room(ROOM_TAG, x, y, width, height);
      if (!rooms.some(r => !room.isInRadius(r))) {
        rooms.push(room);
        attempts = 0;
      }
      attempts++;
    }
    this.rooms = rooms;
    for (let i = 0; i < rooms.length; i++) {
      for (let j = rooms[i].getY(); j < rooms[i].getY() + rooms[i].getHeight(); j++) {
        for (let k = rooms[i].getX(); k < rooms[i].getX() + rooms[i].getWidth(); k++) {
          this.map[j][k] = 1;
        }
      }
    }
  }

  private generateStairs(): void {
    const randRoom = this.rooms[getRandomArbitrary(0, this.rooms.length - 1)];
    const randX = getRandomArbitrary(randRoom.getX(), randRoom.getX() + randRoom.getWidth());
    const randY = getRandomArbitrary(randRoom.getY(), randRoom.getY() + randRoom.getHeight());
    this.map[randY][randX] = 2;
  }
}

export default Level;
