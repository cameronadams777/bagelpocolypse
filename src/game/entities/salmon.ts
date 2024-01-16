import SalmonImage from "../../assets/images/salmon.png";
import { GameTags } from "../../constants";
import Vector2 from "../math/vector2";
import Camera from "./camera";
import GameObject from "./game-object";

const salmonSprite = new Image();
salmonSprite.src = SalmonImage;

class Salmon extends GameObject {
  private frameX: number;
  private frameCounter: number;
  constructor(position: Vector2, width: number, height: number) {
    super(GameTags.SALMON_TAG, position, width, height);
    this.frameX = 0;
    this.frameCounter = 0;
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (this.frameCounter % 7 === 0) {
      if (this.frameX + 1 > 3) this.frameX = 0;
      else this.frameX++;
    }
    ctx.drawImage(
      salmonSprite,
      this.frameX * this.width,
      1,
      this.width,
      this.height,
      this.position.x - camera.getPosition().x,
      this.position.y - camera.getPosition().y,
      this.width,
      this.height
    );
    this.frameCounter += 1;
  }
}

export default Salmon;
