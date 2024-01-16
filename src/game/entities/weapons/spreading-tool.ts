import { GameTags, TILE_SIZE } from "../../../constants";
import Vector2 from "../../math/vector2";
import Camera from "../camera";
import GameObject from "../game-object";

class SpreadingTool extends GameObject {
  constructor(position: Vector2, width: number, height: number) {
    super(GameTags.SPREADING_TOOL_TAG, position, width, height);
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    ctx.fillStyle = "grey";
    ctx.fillRect(
      this.position.x - camera.getPosition().x,
      this.position.y - camera.getPosition().y,
      TILE_SIZE,
      TILE_SIZE
    );
  }
}

export default SpreadingTool;
