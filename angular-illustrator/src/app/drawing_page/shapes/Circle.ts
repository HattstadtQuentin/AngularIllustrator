import { Tools } from '../tools.enum';
import { Coordonnees, Shape, ShapeParameters } from './Shape';

export class Circle extends Shape {
  constructor(parameters: ShapeParameters) {
    super(Tools.Circle, parameters);
  }

  override center(): Coordonnees {
    return this.parameters.coordList[0];
  }

  override intersect(coord: Coordonnees): boolean {
    if (this.parameters.coordList.length < 2) {
      return false;
    }

    const largeur = Math.abs(
      this.parameters.coordList[1].x - this.parameters.coordList[0].x
    );
    const hauteur = Math.abs(
      this.parameters.coordList[1].y - this.parameters.coordList[0].y
    );
    const rayon =
      (Math.sqrt(largeur * largeur + hauteur * hauteur) +
        this.parameters.thickness) *
      this.parameters.scaleFactor;

    const distance = Math.sqrt(
      Math.pow(coord.x - this.parameters.coordList[0].x, 2) +
        Math.pow(coord.y - this.parameters.coordList[0].y, 2)
    );
    return distance <= rayon;
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
        ctx.rotate((this.parameters.rotateAngle * Math.PI) / 180);
        ctx.translate(-center.x, -center.y);
        ctx.lineWidth = this.parameters.thickness;

        const largeur = Math.abs(
          this.parameters.coordList[1].x - this.parameters.coordList[0].x
        );
        const hauteur = Math.abs(
          this.parameters.coordList[1].y - this.parameters.coordList[0].y
        );
        const rayon = Math.sqrt(largeur * largeur + hauteur * hauteur);

        ctx.beginPath();

        ctx.fillStyle = this.parameters.colorFillShape;
        ctx.strokeStyle = this.parameters.colorStrokeShape;
        ctx.arc(
          this.parameters.coordList[0].x,
          this.parameters.coordList[0].y,
          rayon,
          0,
          Math.PI * 2,
          true
        );
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}
