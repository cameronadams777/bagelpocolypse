import GameObject from "./game-object";

class CreamCheese extends GameObject {
  constructor(tag: string, x: number, y: number, width: number, height: number) {
    super(tag, x, y, width, height);
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#FAE7C8";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default CreamCheese;
