import GameObject from "./game-object";
import Vector2 from "../math/vector2";
import { GameTag } from "../../constants";

const PROXIMITY_RADIUS_OFFSET = 3;

export class Room extends GameObject {
  private hasPlayer: boolean;
  private hasStairs: boolean;
  private hasBagels: boolean;

  constructor(position: Vector2, width: number, height: number) {
    super(GameTag.ROOM_TAG, position, width, height);
    this.hasPlayer = false;
    this.hasStairs = false;
    this.hasBagels = false;
  }

  public isInRadius(room: Room): boolean {
    return (
      this.getBottom() + PROXIMITY_RADIUS_OFFSET <= room.getPosition().y ||
      this.position.y - PROXIMITY_RADIUS_OFFSET >= room.getBottom() ||
      this.getRight() + PROXIMITY_RADIUS_OFFSET <= room.getPosition().x ||
      this.position.x - PROXIMITY_RADIUS_OFFSET >= room.getRight()
    );
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

  public getHasBagels(): boolean {
    return this.hasBagels;
  }

  public setHasBagels(hasBagels: boolean): void {
    this.hasBagels = hasBagels;
  }
}
