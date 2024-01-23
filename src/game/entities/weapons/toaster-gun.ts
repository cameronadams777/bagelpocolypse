import { GameTag } from "../../../constants";
import Vector2 from "../../math/vector2";
import Camera from "../camera";
import GameObject from "../game-object";
import ToasterGunSheet from "@/assets/images/toaster-gun-Sheet.png";

const toasterGunSpriteSheet = new Image();
toasterGunSpriteSheet.src = ToasterGunSheet;

class ToasterGun extends GameObject {
  private frameCounter: number;
  private frameX: number;
  constructor(position: Vector2, width: number, height: number) {
    super(GameTag.TOASTER_GUN, position, width, height);
    this.frameX = 0;
    this.frameCounter = 0;
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (this.frameCounter % 7 === 0) {
      if (this.frameX + 1 > 2) this.frameX = 0;
      else this.frameX++;
    }
    ctx.drawImage(
      toasterGunSpriteSheet,
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

export default ToasterGun;
