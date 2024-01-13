import { TILE_SIZE } from "../../constants";
import Vector2 from "../math/vector2";
import GameObject from "./game-object";

const RENDER_OFFSET_RADIUS = TILE_SIZE * 10;

class Camera extends GameObject {
  private follow: GameObject | undefined;

  constructor(tag: string, position: Vector2, width: number, height: number) {
    super(tag, position, width, height);
    this.follow = undefined;
  }

  public update(): void {
    if (this.follow == null) return;
  }

  public draw(ctx: CanvasRenderingContext2D): void {}

  public getFollowedObject(): GameObject | undefined {
    return this.follow;
  }

  public setFollowedObject(gameObject: GameObject | undefined): void {
    this.follow = gameObject;
  }
}

export default Camera;
