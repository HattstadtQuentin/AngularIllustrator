import { Tools } from '../tools.enum';
import { Coordonnees, Shape, ShapeParameters } from './Shape';

export class Eraser extends Shape {
  constructor(parameters: ShapeParameters) {
    super(Tools.Eraser, parameters);
  }

  override intersect(coord: Coordonnees): boolean {
    return false;
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

    if (this.parameters.coordList.length > 1 || !prevision) {
      if (ctx) {
        ctx.strokeStyle = this.parameters.colorFillShape;
        ctx.lineWidth = this.parameters.thickness;
        ctx.globalCompositeOperation = 'destination-out';

        this.parameters.coordList.forEach((coordElem, index) => {
          if (index === 0) {
            // if this is the first point, start a new path
            ctx.beginPath();
            ctx.moveTo(coordElem.x, coordElem.y);
          } else {
            // if this is not the first point, add it to the current path
            ctx.lineTo(coordElem.x, coordElem.y);
          }
        });

        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      }
    }
  }
}
