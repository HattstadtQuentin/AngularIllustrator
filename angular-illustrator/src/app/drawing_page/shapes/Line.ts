import { Tools } from '../tools.enum';
import { Coordonnees, Shape, ShapeParameters } from './Shape';

export class Line extends Shape {
  constructor(parameters: ShapeParameters) {
    super(Tools.Line, parameters);
  }

  override intersect(coord: Coordonnees): boolean {
    if (this.parameters.coordList.length < 2) {
      return false;
    }

    const slope =
      (this.parameters.coordList[1].y - this.parameters.coordList[0].y) /
      (this.parameters.coordList[1].x - this.parameters.coordList[0].x);
    const yIntercept =
      this.parameters.coordList[0].y - slope * this.parameters.coordList[0].x;

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
      if (this.parameters.coordList.length == 2) {
        this.parameters.coordList.pop();
      }
      this.parameters.coordList.push(coord);
    }

    if (this.parameters.coordList.length == 2 || !prevision) {
      if (ctx) {
        ctx.strokeStyle = this.parameters.colorFillShape;
        ctx.lineWidth = this.parameters.thickness;
        ctx.beginPath();
        ctx.moveTo(
          this.parameters.coordList[0].x,
          this.parameters.coordList[0].y
        );
        ctx.lineTo(
          this.parameters.coordList[1].x,
          this.parameters.coordList[1].y
        );
        ctx.stroke();
      }
    }
  }
}
