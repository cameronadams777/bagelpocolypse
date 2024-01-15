import Vector2 from "../math/vector2";
import Camera from "./camera";

class GameObject {
  protected tag: string;
  protected position: Vector2;
  protected width: number;
  protected height: number;

  constructor(tag: string, position: Vector2, width: number, height: number) {
    this.tag = tag;
    this.position = position;
    this.width = width;
    this.height = height;
  }

  public update(): void {}
  public draw(_ctx: CanvasRenderingContext2D, _camera: Camera): void {}

  public isCollidingWith(gameObject: GameObject): boolean {
    return (
      this.getBottom() <= gameObject.position.y ||
      this.position.y >= gameObject.getBottom() + 1 ||
      this.getRight() <= gameObject.position.x ||
      this.position.x >= gameObject.getRight() + 1
    );
  }

  public getTag(): string {
    return this.tag;
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

export default GameObject;
