import { GameTags } from "../../../constants";
import Vector2 from "../../math/vector2";
import Camera from "../camera";
import GameObject from "../game-object";

class ToasterGun extends GameObject {
  constructor(position: Vector2, width: number, height: number) {
    super(GameTags.TOASTER_GUN, position, width, height);
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    ctx.fillStyle = "orange";
    ctx.fillRect(
      this.position.x - camera.getPosition().x,
      this.position.y - camera.getPosition().y,
      this.width,
      this.height
    );
  }
}

export default ToasterGun;
