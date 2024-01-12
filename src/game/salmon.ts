import GameObject from "./game-object";

class Salmon extends GameObject {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height)
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "hotpink";
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}

export default Salmon;
