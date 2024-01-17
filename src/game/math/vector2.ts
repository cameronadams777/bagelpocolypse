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

  public static Normalize(vector: Vector2): Vector2 {
    const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    if (magnitude === 0) return vector;
    return new Vector2(Math.round(vector.x / magnitude), Math.round(vector.y / magnitude));
  }
}

export default Vector2;
