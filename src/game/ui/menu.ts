import Vector2 from "../math/vector2";
import Button from "./button";

export class SubMenu {
  private position: Vector2;
  private width: number;
  private height: number;
  private backgroundColor: string;

  constructor(position: Vector2, width: number, height: number, backgroundColor: string) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.backgroundColor = backgroundColor;
  }

  public draw(ctx: CanvasRenderingContext2D, onDraw: (ctx: CanvasRenderingContext2D) => void): void {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    onDraw(ctx);
  }

  public getPosition(): Vector2 {
    return this.position;
  }
}

class Menu {
  private canvas: HTMLCanvasElement;
  private buttons: Button[];
  private backgroundColor: string;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.buttons = [];
    this.backgroundColor = "";
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const title = "Bagelpocolypse";
    const titleMeasurements = ctx.measureText(title);
    ctx.font = "100px Creepster";
    ctx.fillStyle = "red";
    ctx.textAlign = "left";
    ctx.fillText(title, this.canvas.width / 2 - titleMeasurements.width * 1.75, this.canvas.height * 0.25);

    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].draw(ctx);
    }
  }

  public create(): Menu {
    window.addEventListener("click", (e: MouseEvent) => {
      for (let i = 0; i < this.buttons.length; i++) {
        if (
          e.clientX > this.buttons[i].getPosition().x &&
          e.clientX < this.buttons[i].getRight() &&
          e.clientY > this.buttons[i].getPosition().y &&
          e.clientY < this.buttons[i].getBottom()
        )
          this.buttons[i].click();
      }
    });

    window.addEventListener("mousemove", (e: MouseEvent) => {
      for (let i = 0; i < this.buttons.length; i++) {
        if (
          e.clientX > this.buttons[i].getPosition().x &&
          e.clientX < this.buttons[i].getRight() &&
          e.clientY > this.buttons[i].getPosition().y &&
          e.clientY < this.buttons[i].getBottom()
        ) {
          this.canvas.setAttribute("style", "cursor: pointer;");
          this.buttons[i].setIsHovered(true);
          return;
        } else {
          this.buttons[i].setIsHovered(false);
        }
      }
      this.canvas.setAttribute("style", "cursor: normal;");
    });
    return this;
  }

  public addButton(button: Button): Menu {
    this.buttons.push(button);
    return this;
  }

  public setBackgroundColor(backgroundColor: string): Menu {
    this.backgroundColor = backgroundColor;
    return this;
  }
}

export default Menu;
