import { TILE_SIZE } from "../../constants";
import Vector2 from "../math/vector2";
import GameObject from "./game-object";

const RENDER_OFFSET_RADIUS = TILE_SIZE * 5;

class Camera {
  private position: Vector2;
  private width: number;
  private height: number;
  private follow: GameObject | undefined;

  constructor(position: Vector2, width: number, height: number) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.follow = undefined;
  }

  public update(deltaTime: number, map: number[][]): void {
    if (this.follow == null) return;
    let newCameraX: number;
    let newCameraY: number;

    // Ensure that camera cannot render anything outside of our floor map
    if (this.follow.getPosition().x - this.width / 2 < 0) newCameraX = 0;
    else if (this.follow.getPosition().x + this.width / 2 > (map[0].length - 1) * TILE_SIZE)
      newCameraX = (map[0].length - 1) * TILE_SIZE - this.width;
    else newCameraX = this.follow.getPosition().x - this.width / 2;

    if (this.follow.getPosition().y - this.height / 2 < 0) newCameraY = 0;
    else if (this.follow.getPosition().y + this.height / 2 > (map.length - 1) * TILE_SIZE)
      newCameraY = (map.length - 1) * TILE_SIZE - this.height;
    else newCameraY = this.follow.getPosition().y - this.height / 2;

    this.position = new Vector2(newCameraX, newCameraY);
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

  public getPosition(): Vector2 {
    return this.position;
  }

  public setPosition(position: Vector2): void {
    this.position = position;
  }

  public getWidth(): number {
    return this.width;
  }

  public setWidth(width: number): void {
    this.width = width;
  }

  public getHeight(): number {
    return this.height;
  }

  public setHeight(height: number): void {
    this.height = height;
  }

  public getRight(): number {
    return this.position.x + this.width;
  }

  public getBottom(): number {
    return this.position.y + this.height;
  }
}

export default Camera;
