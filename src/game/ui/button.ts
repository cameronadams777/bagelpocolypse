import Vector2 from "../math/vector2";

class Button {
  private position: Vector2;
  private width: number;
  private height: number;
  private text: string;
  private backgroundColor: string;
  private textColor: string;
  private onClick: () => void;
  constructor(
    position: Vector2,
    width: number,
    height: number,
    text: string,
    backgroundColor: string,
    textColor: string,
    onClick: () => void
  ) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.text = text;
    this.backgroundColor = backgroundColor;
    this.textColor = textColor;
    this.onClick = onClick;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = this.textColor;
    ctx.font = "20px Verdana";
    const metrics = ctx.measureText(this.text);
    const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    ctx.fillText(
      this.text,
      this.getRight() - this.width / 2 - metrics.width / 2,
      this.getBottom() - this.height / 2 + textHeight / 2
    );
  }

  public getPosition(): Vector2 {
    return this.position;
  }

  public getRight(): number {
    return this.position.x + this.width;
  }

  public getBottom(): number {
    return this.position.y + this.height;
  }

  public click(): void {
    this.onClick();
  }
}

export default Button;
