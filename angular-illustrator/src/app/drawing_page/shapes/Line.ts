import { Tools } from '../tools.enum';
import { Coordonnees, Shape } from './Shape';

export class Line extends Shape {
  constructor(
    fill: boolean,
    stroke: boolean,
    colorFillShape: string,
    colorStrokeShape: string,
    coordList: Coordonnees[]
  ) {
    super(
      Tools.Line,
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
      if (this.coordList.length == 2) {
        this.coordList.pop();
      }
      this.coordList.push(coord);
    }

    if (this.coordList.length == 2 || !prevision) {
      if (ctx) {
        ctx.strokeStyle = this.colorFillShape;
        ctx.moveTo(this.coordList[0].x, this.coordList[0].y);
        ctx.lineTo(this.coordList[1].x, this.coordList[1].y);
        ctx.stroke();
      }
    }
  }
}
