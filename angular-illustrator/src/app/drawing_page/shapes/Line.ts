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

  override intersect(coord: Coordonnees): boolean {
    if (this.coordList.length < 2) {
      return false;
    }

    const slope =
      (this.coordList[1].y - this.coordList[0].y) /
      (this.coordList[1].x - this.coordList[0].x);
    const yIntercept = this.coordList[0].y - slope * this.coordList[0].x;

    // Calculate the y-coordinate of the point on the line
    const y = slope * coord.x + yIntercept;

    // Check if the y-coordinate of the point is equal to the y-coordinate of the point on the line
    return Math.abs(y - coord.y) < 2;
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
