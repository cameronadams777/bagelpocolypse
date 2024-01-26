import { TILE_SIZE } from "@/constants";
import Cutscene from "./cutscene";
import PlayerImage from "@/assets/images/player-sheet.png";
import EscapeKeyImage from "@/assets/images/escape-button-sheet.png";
import EnterKeyImage from "@/assets/images/enter-button-sheet.png";

const playerSprite = new Image();
playerSprite.src = PlayerImage;

const escapeKeySheet = new Image();
escapeKeySheet.src = EscapeKeyImage;

const enterKeySheet = new Image();
enterKeySheet.src = EnterKeyImage;

class OpeningScene extends Cutscene {
  private fadeAmount: number;
  private frameX: number;
  private frameY: number;
  private playerPositionTimer: number;
  private playerPosition: number;
  private keyFrameX: number;
  private keyTimer: number;

  constructor(canvas: HTMLCanvasElement, onNext: () => void) {
    const messages: string[] = [
      "This is Ron.",
      "Ron has worked for Lame Company, Inc. for the last 20 years.",
      "Today, Ron has started his day like any other. On his third poop break before 10am, longing to be anywhere else.",
      "But today, some force has begun... changing... all of Ron's coworkers.",
      "After finishing his third flush, Ron make his way to the door...",
      'A voice rings out over the intercom... "ALERT: Bagel outbreak in progress. Evacuations being held on the roof. Please remain calm and slowly make your way to safety."',
      'Ron: "BAGELS?!?! ... And on the day I didn\' bring my coffee mug no less... *sigh*"',
      "Ron begins his ascent..."
    ];
    super(canvas, messages, false, onNext);
    this.fadeAmount = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.playerPositionTimer = 0;
    this.playerPosition = 0;
    this.keyFrameX = 0;
    this.keyTimer = 0;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.fadeAmount < 1.0) this.fadeAmount += 0.01;
    if (this.fadeAmount >= 1.0) this.setShowText(true);
    ctx.globalAlpha = this.fadeAmount;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    super.draw(ctx);

    this.keyTimer += 1;
    if (this.keyTimer % 50 === 0) {
      this.keyFrameX += 1;
      if (this.keyFrameX > 2) this.keyFrameX = 0;
    }

    ctx.drawImage(
      escapeKeySheet,
      this.keyFrameX * TILE_SIZE,
      0,
      TILE_SIZE,
      TILE_SIZE,
      this.canvas.width * 0.01,
      this.canvas.height - 50,
      TILE_SIZE,
      TILE_SIZE
    );

    ctx.font = "20px Verdana";
    ctx.fillStyle = "#000";
    ctx.fillText("Skip", this.canvas.width * 0.03, this.canvas.height - 28);

    ctx.drawImage(
      enterKeySheet,
      this.keyFrameX * (TILE_SIZE * 2),
      0,
      TILE_SIZE * 2,
      TILE_SIZE,
      this.canvas.width * 0.075,
      this.canvas.height - 50,
      TILE_SIZE * 2,
      TILE_SIZE
    );

    ctx.font = "20px Verdana";
    ctx.fillStyle = "#000";
    ctx.fillText("Continue", this.canvas.width * 0.1125, this.canvas.height - 28);

    if (this.currentMessageIndex === this.messages.length - 1) {
      this.frameY = 3;
      this.playerPositionTimer += 1;
      this.playerPosition += 5;
      if (this.playerPositionTimer % 5 === 0) {
        this.frameX += 1;
        if (this.frameX > 3) this.frameX = 0;
      }
    }

    ctx.drawImage(
      playerSprite,
      this.frameX * TILE_SIZE,
      this.frameY * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE,
      this.canvas.width / 2 - TILE_SIZE / 2 + this.playerPosition,
      this.canvas.height / 2 - TILE_SIZE / 2,
      TILE_SIZE * 2,
      TILE_SIZE * 2
    );
  }
}

export default OpeningScene;
