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
  private title: string;
  private buttons: Button[];
  private backgroundColor: string;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.buttons = [];
    this.backgroundColor = "";
    this.title = "";
  }

  public draw(ctx: CanvasRenderingContext2D, onDraw?: () => void): void {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.title.length) {
      const titleMeasurements = ctx.measureText(this.title);
      ctx.font = "100px Creepster";
      ctx.fillStyle = "red";
      ctx.textAlign = "left";
      ctx.fillText(this.title, this.canvas.width / 2 - titleMeasurements.width * 1.75, this.canvas.height * 0.25);
    }

    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].draw(ctx);
    }

    onDraw?.();
  }

  public create(): Menu {
    window.addEventListener("click", (e: MouseEvent) => this.clickEvent(e, this.buttons));

    window.addEventListener("mousemove", (e: MouseEvent) => this.mouseMoveEvent(e, this.canvas, this.buttons));

    return this;
  }

  public destroy(): Menu {
    window.removeEventListener("click", (e: MouseEvent) => this.clickEvent(e, this.buttons));
    window.removeEventListener("mousemove", (e: MouseEvent) => this.mouseMoveEvent(e, this.canvas, this.buttons));

    return this;
  }

  public setTitle(title: string): Menu {
    this.title = title;
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

  private clickEvent(e: MouseEvent, buttons: Button[]) {
    for (let i = 0; i < buttons.length; i++) {
      if (
        e.clientX > buttons[i].getPosition().x &&
        e.clientX < buttons[i].getRight() &&
        e.clientY > buttons[i].getPosition().y &&
        e.clientY < buttons[i].getBottom()
      )
        buttons[i].click();
    }
  }

  private mouseMoveEvent(e: MouseEvent, canvas: HTMLCanvasElement, buttons: Button[]) {
    for (let i = 0; i < buttons.length; i++) {
      if (
        e.clientX > buttons[i].getPosition().x &&
        e.clientX < buttons[i].getRight() &&
        e.clientY > buttons[i].getPosition().y &&
        e.clientY < buttons[i].getBottom()
      ) {
        canvas.setAttribute("style", "cursor: pointer;");
        buttons[i].setIsHovered(true);
        return;
      } else {
        buttons[i].setIsHovered(false);
      }
    }
    canvas.setAttribute("style", "cursor: normal;");
  }
}

export default Menu;
