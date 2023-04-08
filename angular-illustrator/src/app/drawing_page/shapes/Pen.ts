import { Tools } from '../tools.enum';
import { Coordonnees, Shape } from './Shape';

export class Pen extends Shape {
  constructor(
    fill: boolean,
    stroke: boolean,
    colorFillShape: string,
    colorStrokeShape: string,
    coordList: Coordonnees[]
  ) {
    super(Tools.Pen, fill, stroke, colorFillShape, colorStrokeShape, coordList);
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
      this.coordList.push(coord);
    }

    if (this.coordList.length > 1 || !prevision) {
      if (ctx) {
        ctx.strokeStyle = this.colorFillShape;

        this.coordList.forEach((coordElem, index) => {
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
      }
    }
  }
}
