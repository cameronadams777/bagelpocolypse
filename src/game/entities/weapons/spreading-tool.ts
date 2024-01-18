import { GameTags } from "../../../constants";
import Vector2 from "../../math/vector2";
import Camera from "../camera";
import GameObject from "../game-object";
import SpreadingToolSheet from "../../../assets/images/spreading-tool-Sheet.png";

const spreadingToolSpriteSheet = new Image();
spreadingToolSpriteSheet.src = SpreadingToolSheet;

class SpreadingTool extends GameObject {
  private frameCounter: number;
  private frameX: number;
  constructor(position: Vector2, width: number, height: number) {
    super(GameTags.SPREADING_TOOL_TAG, position, width, height);
    this.frameX = 0;
    this.frameCounter = 0;
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (this.frameCounter % 7 === 0) {
      if (this.frameX + 1 > 2) this.frameX = 0;
      else this.frameX++;
    }
    ctx.drawImage(
      spreadingToolSpriteSheet,
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

export default SpreadingTool;
