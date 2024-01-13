import GameObject from "./game-object";
import Vector2 from "../math/vector2";

const PROXIMITY_RADIUS_OFFSET = 3;

export class Room extends GameObject {
  private center: Vector2;

  constructor(tag: string, position: Vector2, width: number, height: number) {
    super(tag, position, width, height);
    this.center = new Vector2(Math.floor(this.getRight() / 2), Math.floor(this.getBottom() / 2));
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
}
