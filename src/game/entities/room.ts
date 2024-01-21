import GameObject from "./game-object";
import Vector2 from "../math/vector2";
import { GameTag } from "../../constants";

const PROXIMITY_RADIUS_OFFSET = 3;

export class Room extends GameObject {
  private hasPlayer: boolean;
  private hasStairs: boolean;
  private center: Vector2;

  constructor(position: Vector2, width: number, height: number) {
    super(GameTag.ROOM_TAG, position, width, height);
    this.hasPlayer = false;
    this.hasStairs = false;
    this.center = new Vector2(
      Math.floor(this.getPosition().x + this.width / 2),
      Math.floor(this.getPosition().y + this.height / 2)
    );
  }

  public isInRadius(room: Room): boolean {
    return (
      this.getBottom() + PROXIMITY_RADIUS_OFFSET <= room.getPosition().y ||
      this.position.y - PROXIMITY_RADIUS_OFFSET >= room.getBottom() ||
      this.getRight() + PROXIMITY_RADIUS_OFFSET <= room.getPosition().x ||
      this.position.x - PROXIMITY_RADIUS_OFFSET >= room.getRight()
    );
  }

  public getCenter(): Vector2 {
    return this.center;
  }

  public setCenter(center: Vector2): void {
    this.center = center;
  }

  public getHasPlayer(): boolean {
    return this.hasPlayer;
  }

  public setHasPlayer(hasPlayer: boolean): void {
    this.hasPlayer = hasPlayer;
  }

  public getHasStairs(): boolean {
    return this.hasStairs;
  }

  public setHasStairs(hasStairs: boolean): void {
    this.hasStairs = hasStairs;
  }
}
