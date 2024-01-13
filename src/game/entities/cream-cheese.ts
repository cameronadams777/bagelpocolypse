import Vector2 from "../math/vector2";
import GameObject from "./game-object";

class CreamCheese extends GameObject {
  constructor(tag: string, position: Vector2, width: number, height: number) {
    super(tag, position, width, height);
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#FAE7C8";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

export default CreamCheese;
