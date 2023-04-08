import { Tools } from '../tools.enum';
import { Coordonnees, Shape } from './Shape';

export class Triangle extends Shape {
  constructor(
    fill: boolean,
    stroke: boolean,
    colorFillShape: string,
    colorStrokeShape: string,
    coordList: Coordonnees[]
  ) {
    super(
      Tools.Triangle,
      fill,
      stroke,
      colorFillShape,
      colorStrokeShape,
      coordList
    );
  }

  override previsu(coord: Coordonnees): void {
    this.drawingMethod(coord, true);
  }

  override draw(): void {
    this.drawingMethod(null, false);
  }

  private drawingMethod(coord: Coordonnees | null, prevision: boolean): void {
    let canvas: HTMLCanvasElement = document.getElementById(
      'drawingContainer'
    )! as HTMLCanvasElement;
    if (prevision) {
      canvas = document.getElementById(
        'previsualisationContainer'
      )! as HTMLCanvasElement;
    }
    const ctx = canvas.getContext('2d');

    if (prevision && coord !== null) {
      this.coordList.push(coord);
    }

    if (this.coordList.length == 3 || !prevision) {
      if (ctx) {
        ctx.beginPath();

        if (this.fill && this.stroke) {
          ctx.fillStyle = this.colorFillShape;
          ctx.strokeStyle = this.colorStrokeShape;
          ctx.moveTo(this.coordList[0].x, this.coordList[0].y);
          ctx.lineTo(this.coordList[1].x, this.coordList[1].y);
          ctx.lineTo(this.coordList[2].x, this.coordList[2].y);
          ctx.lineTo(this.coordList[0].x, this.coordList[0].y);
          ctx.fill();
          ctx.stroke();
        } else if (this.fill) {
          ctx.fillStyle = this.colorFillShape;
          ctx.moveTo(this.coordList[0].x, this.coordList[0].y);
          ctx.lineTo(this.coordList[1].x, this.coordList[1].y);
          ctx.lineTo(this.coordList[2].x, this.coordList[2].y);
          ctx.fill();
        } else if (this.stroke) {
          ctx.strokeStyle = this.colorStrokeShape;
          ctx.moveTo(this.coordList[0].x, this.coordList[0].y);
          ctx.lineTo(this.coordList[1].x, this.coordList[1].y);
          ctx.lineTo(this.coordList[2].x, this.coordList[2].y);
          ctx.lineTo(this.coordList[0].x, this.coordList[0].y);
          ctx.stroke();
        }
      }
    }
  }
}
