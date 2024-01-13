import { TILE_SIZE } from "../../constants";
import Vector2 from "../math/vector2";
import GameObject from "./game-object";

const RENDER_OFFSET_RADIUS = TILE_SIZE * 5;

class Camera extends GameObject {
  private follow: GameObject | undefined;

  constructor(tag: string, position: Vector2, width: number, height: number) {
    super(tag, position, width, height);
    this.follow = undefined;
  }

  public update(): void {
    if (this.follow == null) return;
    this.position = new Vector2(
      this.follow.getPosition().x - this.width / 2,
      this.follow.getPosition().y - this.height / 2
    );
  }

  public getFollowedObject(): GameObject | undefined {
    return this.follow;
  }

  public setFollowedObject(gameObject: GameObject | undefined): void {
    this.follow = gameObject;
  }

  public isInRadius(gameObject: GameObject): boolean {
    return (
      this.getBottom() + RENDER_OFFSET_RADIUS <= gameObject.getPosition().y ||
      this.position.y - RENDER_OFFSET_RADIUS >= gameObject.getBottom() ||
      this.getRight() + RENDER_OFFSET_RADIUS <= gameObject.getPosition().x ||
      this.position.x - RENDER_OFFSET_RADIUS >= gameObject.getRight()
    );
  }
}

export default Camera;
