class GameObject {
  protected tag: string;
  protected x: number;
  protected y: number;
  protected width: number;
  protected height: number;

  constructor(tag: string, x: number, y: number, width: number, height: number) {
    this.tag = tag;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public update(): void { }
  public draw(_ctx: CanvasRenderingContext2D): void { }

  public isCollidingWith(gameObject: GameObject): boolean {
    return (
        ((this.y + this.height) <= (gameObject.y)) ||
        (this.y >= (gameObject.y + gameObject.height)) ||
        ((this.x + this.width) <= gameObject.x) ||
        (this.x >= (gameObject.x + gameObject.width))
    );
  }

  public getTag(): string {
    return this.tag;
  }

  public getX(): number {
    return this.x;
  }

  public setX(x: number): void {
    this.x = x;
  }

  public getY(): number {
    return this.y;
  }

  public setY(y: number): void {
    this.y = y;
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
}

export default GameObject;
