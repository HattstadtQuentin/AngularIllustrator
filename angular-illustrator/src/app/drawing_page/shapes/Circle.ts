import { Tools } from '../tools.enum';
import { Coordonnees, Shape } from './Shape';

export class Circle extends Shape {
  constructor(
    fill: boolean,
    stroke: boolean,
    colorFillShape: string,
    colorStrokeShape: string,
    coordList: Coordonnees[]
  ) {
    super(
      Tools.Circle,
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

    const largeur = Math.abs(this.coordList[1].x - this.coordList[0].x);
    const hauteur = Math.abs(this.coordList[1].y - this.coordList[0].y);
    const rayon = Math.sqrt(largeur * largeur + hauteur * hauteur);

    const distance = Math.sqrt(
      Math.pow(coord.x - this.coordList[0].x, 2) +
        Math.pow(coord.y - this.coordList[0].y, 2)
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
      if (this.coordList.length == 2) {
        this.coordList.pop();
      }
      this.coordList.push(coord);
    }

    if (this.coordList.length == 2 || !prevision) {
      let largeur = 0;
      let hauteur = 0;
      let rayon = 0;
      if (ctx) {
        largeur = Math.abs(this.coordList[1].x - this.coordList[0].x);
        hauteur = Math.abs(this.coordList[1].y - this.coordList[0].y);
        rayon = Math.sqrt(largeur * largeur + hauteur * hauteur);

        ctx.beginPath();

        if (this.fill && this.stroke) {
          ctx.fillStyle = this.colorFillShape;
          ctx.strokeStyle = this.colorStrokeShape;
          ctx.arc(
            this.coordList[0].x,
            this.coordList[0].y,
            rayon,
            0,
            Math.PI * 2,
            true
          );
          ctx.fill();
          ctx.stroke();
        } else if (this.fill) {
          ctx.fillStyle = this.colorFillShape;
          ctx.arc(
            this.coordList[0].x,
            this.coordList[0].y,
            rayon,
            0,
            Math.PI * 2,
            true
          );
          ctx.fill();
        } else if (this.stroke) {
          ctx.strokeStyle = this.colorStrokeShape;
          ctx.arc(
            this.coordList[0].x,
            this.coordList[0].y,
            rayon,
            0,
            Math.PI * 2,
            true
          );
          ctx.stroke();
        }
      }
    }
  }
}
