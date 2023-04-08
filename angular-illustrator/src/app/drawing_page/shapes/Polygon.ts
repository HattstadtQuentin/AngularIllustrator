import { Tools } from '../tools.enum';
import { Coordonnees, Shape, ShapeParameters } from './Shape';

export class Polygon extends Shape {
  constructor(parameters: ShapeParameters) {
    super(Tools.Polygon, parameters);
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
      this.parameters.coordList.push(coord);
    }

    if (this.parameters.coordList.length == 3 || !prevision) {
      if (ctx) {
        ctx.beginPath();

        if (this.parameters.fill && this.parameters.stroke) {
          ctx.fillStyle = this.parameters.colorFillShape;
          ctx.strokeStyle = this.parameters.colorStrokeShape;
          ctx.moveTo(
            this.parameters.coordList[0].x,
            this.parameters.coordList[0].y
          );
          ctx.lineTo(
            this.parameters.coordList[1].x,
            this.parameters.coordList[1].y
          );
          ctx.lineTo(
            this.parameters.coordList[2].x,
            this.parameters.coordList[2].y
          );
          ctx.lineTo(
            this.parameters.coordList[0].x,
            this.parameters.coordList[0].y
          );
          ctx.fill();
          ctx.stroke();
        } else if (this.parameters.fill) {
          ctx.fillStyle = this.parameters.colorFillShape;
          ctx.moveTo(
            this.parameters.coordList[0].x,
            this.parameters.coordList[0].y
          );
          ctx.lineTo(
            this.parameters.coordList[1].x,
            this.parameters.coordList[1].y
          );
          ctx.lineTo(
            this.parameters.coordList[2].x,
            this.parameters.coordList[2].y
          );
          ctx.fill();
        } else if (this.parameters.stroke) {
          ctx.strokeStyle = this.parameters.colorStrokeShape;
          ctx.moveTo(
            this.parameters.coordList[0].x,
            this.parameters.coordList[0].y
          );
          ctx.lineTo(
            this.parameters.coordList[1].x,
            this.parameters.coordList[1].y
          );
          ctx.lineTo(
            this.parameters.coordList[2].x,
            this.parameters.coordList[2].y
          );
          ctx.lineTo(
            this.parameters.coordList[0].x,
            this.parameters.coordList[0].y
          );
          ctx.stroke();
        }
      }
    }
  }
}
