import { Tools } from '../tools.enum';
import { Coordonnees, Shape, ShapeParameters } from './Shape';

export class Pen extends Shape {
  constructor(parameters: ShapeParameters) {
    super(Tools.Pen, parameters);
  }

  override center(): Coordonnees {
    let sumX = 0;
    let sumY = 0;

    this.parameters.coordList.forEach((coord) => {
      sumX += coord.x;
      sumY += coord.y;
    });

    return new Coordonnees(
      sumX / this.parameters.coordList.length,
      sumY / this.parameters.coordList.length
    );
  }

  override intersect(coord: Coordonnees): boolean {
    let result = false;
    this.parameters.coordList.forEach((coordElem) => {
      const distance = Math.sqrt(
        (coordElem.x - coord.x) ** 2 + (coordElem.y - coord.y) ** 2
      );

      if (distance <= this.parameters.thickness / 1.5) {
        result = true;
      }
      return;
    });
    return result;
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
        ctx.save();
        const center = this.center();
        ctx.translate(center.x, center.y);
        ctx.scale(this.parameters.scaleFactor, this.parameters.scaleFactor);
        ctx.rotate((this.parameters.rotateAngle * Math.PI) / 180);
        ctx.translate(-center.x, -center.y);
        ctx.strokeStyle = this.parameters.colorFillShape;
        ctx.lineWidth = this.parameters.thickness;

        this.parameters.coordList.forEach((coordElem, index) => {
          if (index === 0) {
            ctx.beginPath();
            ctx.moveTo(coordElem.x, coordElem.y);
          } else {
            ctx.lineTo(coordElem.x, coordElem.y);
          }
        });

        ctx.stroke();
        ctx.restore();
      }
    }
  }
}
