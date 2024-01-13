class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public add(vec: Vector2): void {
    this.x += vec.x;
    this.y += vec.y;
  }

  public static Zero(): Vector2 {
    return new Vector2(0, 0);
  }
}

export default Vector2;
