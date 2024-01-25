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
import { TILE_SIZE, TileMap } from "@/constants";
import Cutscene from "./cutscene";
import { Room } from "../entities/room";
import Vector2 from "../math/vector2";

const messages: string[] = [""];

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

class EndingScene extends Cutscene {
  private fadeAmount: number;
  private map: TileMap[][];
  private room: Room;

  constructor(canvas: HTMLCanvasElement, onNext: () => void) {
    super(canvas, messages, false, onNext);
    this.fadeAmount = 0;
    this.map = this.generateMap(this.canvas.width, this.canvas.height);
    this.room = new Room(Vector2.Zero(), 2, 2);
    this.generateRoom();
    this.generateWalls();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.fadeAmount < 1.0) this.fadeAmount += 0.01;
    if (this.fadeAmount >= 1.0) this.setShowText(true);
    ctx.globalAlpha = this.fadeAmount;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let j = 0; j < this.map.length; j++) {
      for (let i = 0; i < this.map[0].length; i++) {
        ctx.drawImage(tileMap[this.map[j][i]], i * TILE_SIZE, j * TILE_SIZE);
      }
    }

    super.draw(ctx);
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

  private generateRoom(): void {
    const startX = Math.floor(this.map[0].length * 0.4);
    const startY = Math.floor(this.map.length / 8);
    const roomWidth = Math.floor(this.map[0].length * 0.6);
    const roomHeight = Math.floor(this.map.length * 0.7);
    this.room = new Room(new Vector2(startX * TILE_SIZE, startY * TILE_SIZE), roomWidth, roomHeight);
    for (let j = startY; j < roomHeight; j++) {
      for (let i = startX; i < roomWidth; i++) {
        this.map[j][i] = TileMap.FLOOR;
      }
    }
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
}

export default EndingScene;
