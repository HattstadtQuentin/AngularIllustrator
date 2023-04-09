import { Tools } from '../tools.enum';
import { Coordonnees, Shape, ShapeParameters } from './Shape';

export class Line extends Shape {
  constructor(parameters: ShapeParameters) {
    super(Tools.Line, parameters);
  }

  override center(): Coordonnees {
    return new Coordonnees(
      (this.parameters.coordList[0].x + this.parameters.coordList[1].x) / 2,
      (this.parameters.coordList[0].y + this.parameters.coordList[1].y) / 2
    );
  }

  override intersect(coord: Coordonnees): boolean {
    if (this.parameters.coordList.length < 2) {
      return false;
    }
    // Calculate the distance between the point and the line
    const distance =
      Math.abs(
        (this.parameters.coordList[1].y - this.parameters.coordList[0].y) *
          coord.x -
          (this.parameters.coordList[1].x - this.parameters.coordList[0].x) *
            coord.y +
          this.parameters.coordList[1].x * this.parameters.coordList[0].y -
          this.parameters.coordList[1].y * this.parameters.coordList[0].x
      ) /
      Math.sqrt(
        Math.pow(
          this.parameters.coordList[1].y - this.parameters.coordList[0].y,
          2
        ) +
          Math.pow(
            this.parameters.coordList[1].x - this.parameters.coordList[0].x,
            2
          )
      );

    // Compare the distance to half the thickness of the line
    if (distance <= this.parameters.thickness / 2) {
      return true;
    }

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
      if (this.parameters.coordList.length == 2) {
        this.parameters.coordList.pop();
      }
      this.parameters.coordList.push(coord);
    }

    if (this.parameters.coordList.length == 2 || !prevision) {
      if (ctx) {
        ctx.save();
        const center = this.center();
        ctx.translate(center.x, center.y);
        ctx.scale(this.parameters.scaleFactor, this.parameters.scaleFactor);
        ctx.translate(-center.x, -center.y);
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
        ctx.restore();
      }
    }
  }
}
