import CreamCheeseImage from "@/assets/images/cream-cheese.png";
import { GameTag } from "@/constants";
import Vector2 from "../math/vector2";
import Camera from "./camera";
import GameObject from "./game-object";

const creamCheeseSprite = new Image();
creamCheeseSprite.src = CreamCheeseImage;

class CreamCheese extends GameObject {
  constructor(position: Vector2, width: number, height: number) {
    super(GameTag.CREAM_CHEESE_TAG, position, width, height);
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    ctx.drawImage(
      creamCheeseSprite,
      this.position.x - camera.getPosition().x,
      this.position.y - camera.getPosition().y,
      this.width,
      this.height
    );
  }
}

export default CreamCheese;
