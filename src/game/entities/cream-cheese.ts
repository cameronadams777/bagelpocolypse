import { GameTag } from "../../constants";
import Vector2 from "../math/vector2";
import Camera from "./camera";
import GameObject from "./game-object";

class CreamCheese extends GameObject {
  constructor(position: Vector2, width: number, height: number) {
    super(GameTag.CREAM_CHEESE_TAG, position, width, height);
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    ctx.fillStyle = "#FAE7C8";
    ctx.fillRect(
      this.position.x - camera.getPosition().x,
      this.position.y - camera.getPosition().y,
      this.width,
      this.height
    );
  }
}

export default CreamCheese;
