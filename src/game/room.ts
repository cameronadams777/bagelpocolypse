import GameObject from "./game-object";

const PROXIMITY_RADIUS_OFFSET = 3;

export class Room extends GameObject {
  constructor(tag: string, x: number, y: number, width: number, height: number) {
    super(tag, x, y, width, height);
  }

  public isInRadius(room: Room): boolean {
    return (
      ((this.y + this.height + PROXIMITY_RADIUS_OFFSET) <= (room.getY())) ||
      (this.y - PROXIMITY_RADIUS_OFFSET >= (room.getY() + room.getHeight())) ||
      ((this.x + this.width + PROXIMITY_RADIUS_OFFSET) <= room.getX()) ||
      (this.x - PROXIMITY_RADIUS_OFFSET >= (room.getX() + room.getWidth()))
    );
  }
}
