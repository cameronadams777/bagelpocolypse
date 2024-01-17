import Button from "./button";

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
        ) {
          this.buttons[i].click();
        }
      }
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
