import { Tools } from '../tools.enum';
import { Coordonnees, Shape, ShapeParameters } from './Shape';

export class Rect extends Shape {
  constructor(parameters: ShapeParameters) {
    super(Tools.Polygon, parameters);
  }

  override intersect(coord: Coordonnees): boolean {
    const largeur =
      this.parameters.coordList[1].x - this.parameters.coordList[0].x;
    const hauteur =
      this.parameters.coordList[1].y - this.parameters.coordList[0].y;
    if (
      coord.x < this.parameters.coordList[0].x ||
      coord.x > this.parameters.coordList[0].x + largeur
    ) {
      return false;
    }
    if (
      coord.y < this.parameters.coordList[0].y ||
      coord.y > this.parameters.coordList[0].y + hauteur
    ) {
      return false;
    }
    return true;
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
      let largeur = 0;
      let hauteur = 0;
      if (ctx) {
        largeur =
          this.parameters.coordList[1].x - this.parameters.coordList[0].x;
        hauteur =
          this.parameters.coordList[1].y - this.parameters.coordList[0].y;

        ctx.fillStyle = this.parameters.colorFillShape;
        ctx.strokeStyle = this.parameters.colorStrokeShape;
        ctx.lineWidth = this.parameters.thickness;
        ctx.fillRect(
          this.parameters.coordList[0].x,
          this.parameters.coordList[0].y,
          largeur,
          hauteur
        );
        ctx.strokeRect(
          this.parameters.coordList[0].x,
          this.parameters.coordList[0].y,
          largeur,
          hauteur
        );
      }
    }
  }
}
