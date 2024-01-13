import ConcreteImage from "../assets/images/concrete.png";
import StoneImage from "../assets/images/stone.png";
import StairsImage from "../assets/images/stairs.png";
import { getRandomArbitrary } from "../helpers";
import { Room } from "./room";
import { GameTags, MAX_ROOM_COUNT, MAX_ROOM_GEN_ATTEMPTS_COUNT, MAX_ROOM_HEIGHT, MAX_ROOM_WIDTH, MIN_ROOM_HEIGHT, MIN_ROOM_WIDTH, PLAYER_SPEED, TILE_SIZE } from "../constants";
import Player from "./player";
import Bagel from "./bagel";
import GameObject from "./game-object";

const stairsSprite = new Image();
stairsSprite.src = StairsImage;

const concreteSprite = new Image();
concreteSprite.src = ConcreteImage;

const floorSprite = new Image();
floorSprite.src = StoneImage;

const tileMap: Record<number, HTMLImageElement> = {
  0: floorSprite,
  1: concreteSprite,
  2: stairsSprite,
  3: concreteSprite, // Player location
  4: concreteSprite, // Bagel location
}

const entityConstants = [2, 3, 4];

const generateSpawnCoordinates = (map: number[][], rooms: Room[]): { x: number, y: number } => {
  const randRoom = rooms[getRandomArbitrary(0, rooms.length - 1)];
  let randX: number | undefined;
  let randY: number | undefined;
  while (randX == null || randY == null || entityConstants.includes(map[randY][randX])) {
    randX = getRandomArbitrary(randRoom.getX(), randRoom.getX() + randRoom.getWidth());
    randY = getRandomArbitrary(randRoom.getY(), randRoom.getY() + randRoom.getHeight());
  }
  return {
    x: randX,
    y: randY
  }
}

class Level {
  private playerInitialSpawn: { x: number, y: number };
  private player: Player;
  private bagels: Bagel[];
  private map: number[][];
  private rooms: Room[];
  private gameObjects: Array<GameObject | undefined>;

  constructor(canvas: HTMLCanvasElement) {
    this.map = this.generateMap(canvas);
    this.rooms = [];
    this.playerInitialSpawn = { x: 0, y: 0 };
    this.generateRooms();
    this.generateStairs();
    this.player = this.spawnPlayer();
    this.bagels = this.spawnBagels();
    this.gameObjects = [this.player, ...this.bagels];
  }

  public update(): void {
    const prevLives = this.player.getLives();
    for (let i = 0; i < this.gameObjects.length; i++) {
      for (let j = 0; j < this.gameObjects.length; j++) {
        if (this.gameObjects[i] == null || this.gameObjects[j] == null || this.gameObjects[i] === this.gameObjects[j]) continue;

        // Player collision logic
        if (this.gameObjects[i]?.getTag() === GameTags.PLAYER_TAG) {
          const p = this.gameObjects[i] as Player
          if (!p.isCollidingWith(this.gameObjects[j]!)) {
            if (this.gameObjects[j]?.getTag() === GameTags.BAGEL_TAG) {
              p.setLives(p.getLives() - 1);
              p.setX(this.playerInitialSpawn.x * TILE_SIZE);
              p.setY(this.playerInitialSpawn.y * TILE_SIZE);
            }
            if (this.gameObjects[j]?.getTag() === GameTags.SALMON_TAG) {
              this.gameObjects[j] = undefined;
              this.player.setPlayerSpeedConstant(10);
              setTimeout(() => this.player.setPlayerSpeedConstant(5), 5000)
            }
            if (this.gameObjects[j]?.getTag() === GameTags.CREAM_CHEESE_TAG) {
              this.gameObjects[j] = undefined;
              this.player.setPlayerSpeedConstant(2);
              setTimeout(() => this.player.setPlayerSpeedConstant(5), 5000)
            }
          }
        }

        if (this.gameObjects[i]?.getTag() === GameTags.BAGEL_TAG) {
          const b = this.gameObjects[i] as Bagel;
          if (prevLives != this.player.getLives()) b.setGameObjectToFollow(undefined);
          if (!b.getGameObjectToFollow() && !b.isInRadius(this.gameObjects[j]!) && b.isFollowableItem(this.gameObjects[j]?.getTag()!)) {
            b.setState("following");
            b.setGameObjectToFollow(this.gameObjects[j]!);
          }
        }
      }

      this.gameObjects[i]?.update(this.map);
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    for (let j = 0; j < this.map.length; j++) {
      for (let i = 0; i < this.map[j].length; i++) {
        ctx.drawImage(tileMap[this.map[j][i]], i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }



    for (let i = 0; i < this.gameObjects.length; i++)
      this.gameObjects[i]?.draw(ctx);
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

  private generateRooms(): void {
    let attempts = 0;
    const rooms: Room[] = [];
    while (rooms.length < MAX_ROOM_COUNT && attempts < MAX_ROOM_GEN_ATTEMPTS_COUNT) {
      const x = Math.floor(getRandomArbitrary(1, (this.map[0].length - 1) - MAX_ROOM_WIDTH));
      const y = Math.floor(getRandomArbitrary(1, (this.map.length - 1) - MAX_ROOM_HEIGHT));
      const width = Math.floor(getRandomArbitrary(MIN_ROOM_WIDTH, MAX_ROOM_WIDTH));
      const height = Math.floor(getRandomArbitrary(MIN_ROOM_HEIGHT, MAX_ROOM_HEIGHT));
      const room = new Room(GameTags.ROOM_TAG, x, y, width, height);
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
    const { x, y } = generateSpawnCoordinates(this.map, this.rooms);
    this.map[y][x] = 2;
  }

  private spawnPlayer(): Player {
    const { x, y } = generateSpawnCoordinates(this.map, this.rooms);
    this.playerInitialSpawn = { x, y };
    this.map[y][x] = 3;
    return new Player(GameTags.PLAYER_TAG, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
  }

  private spawnBagels(): Bagel[] {
    const bagels: Bagel[] = [];
    for (let i = 0; i < 3; i++) {
      const { x, y } = generateSpawnCoordinates(this.map, this.rooms);
      bagels.push(new Bagel(GameTags.BAGEL_TAG, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE));
    }
    return bagels;
  }
}

export default Level;
