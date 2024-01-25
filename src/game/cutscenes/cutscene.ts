class Cutscene {
  protected canvas: HTMLCanvasElement;
  protected messages: string[];
  protected currentMessageIndex: number;
  private currentMessageAnimationCounter: number;
  private currentMessageCharacters: string;
  private showText: boolean;

  constructor(canvas: HTMLCanvasElement, messages: string[], showText: boolean, onNext: () => void) {
    this.canvas = canvas;
    this.messages = messages;
    this.showText = showText;
    this.currentMessageIndex = 0;
    this.currentMessageAnimationCounter = 0;
    this.currentMessageCharacters = "";

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        if (this.currentMessageIndex === this.messages.length - 1) {
          onNext();
          return;
        }
        if (this.currentMessageIndex < this.messages.length) this.currentMessageIndex++;
        this.currentMessageAnimationCounter = 0;
        this.currentMessageCharacters = "";
      }
      if (e.code === "Escape") onNext();
    });
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = "lightgrey";
    ctx.fillRect(0, this.canvas.height - 150, this.canvas.width, 150);

    ctx.strokeStyle = "red";
    ctx.lineWidth = 10;
    ctx.strokeRect(0, this.canvas.height - 150, this.canvas.width, 150);

    if (this.showText && this.currentMessageIndex < this.messages.length) {
      this.currentMessageAnimationCounter += 1;
      if (
        this.currentMessageAnimationCounter % 2 === 0 &&
        this.currentMessageCharacters.length <= this.messages[this.currentMessageIndex].length
      )
        this.currentMessageCharacters = this.currentMessageCharacters.concat(
          this.messages[this.currentMessageIndex].charAt(this.currentMessageCharacters.length)
        );

      ctx.fillStyle = "#000";
      ctx.font = `20px Verdana`;
      ctx.fillText(this.currentMessageCharacters, 25, this.canvas.height - 100, this.canvas.width - 50);
    }
  }

  public setShowText(showText: boolean): void {
    this.showText = showText;
  }
}

export default Cutscene;
