import { Tools } from '../tools.enum';
import { Coordonnees, Shape, ShapeParameters } from './Shape';

export class Polygon extends Shape {
  isClosed: boolean;
  nbPoints: number;
  constructor(parameters: ShapeParameters) {
    super(Tools.Polygon, parameters);
    this.isClosed = false;
    this.nbPoints = 2;
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

  override previsu(coord: Coordonnees): void {
    this.drawingMethod(coord, true);
  }

  override draw(): void {
    if (!this.isClosed) this.nbPoints++;
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

    if (!prevision) {
      const distanceFromStart = Math.sqrt(
        Math.pow(
          this.parameters.coordList[0].x -
            this.parameters.coordList[this.parameters.coordList.length - 1].x,
          2
        ) +
          Math.pow(
            this.parameters.coordList[0].y -
              this.parameters.coordList[this.parameters.coordList.length - 1].y,
            2
          )
      );
      if (distanceFromStart < 5 * this.parameters.thickness && !prevision) {
        this.isClosed = true;
      }
    }

    if (prevision && coord !== null) {
      if (this.parameters.coordList.length == this.nbPoints) {
        this.parameters.coordList.pop();
      }
      this.parameters.coordList.push(coord);
    }

    if (this.parameters.coordList.length == this.nbPoints || !prevision) {
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
            // if this is the first point, start a new path
            ctx.beginPath();
            ctx.moveTo(coordElem.x, coordElem.y);
          } else {
            // if this is not the first point, add it to the current path
            ctx.lineTo(coordElem.x, coordElem.y);
          }
        });
        if (this.isClosed) {
          ctx.closePath();
        }
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }
    }
  }
}
