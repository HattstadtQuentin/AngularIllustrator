import { Tools } from '../tools.enum';
import { Coordonnees, Shape } from './Shape';

export class Rect extends Shape {
  constructor(
    fill: boolean,
    stroke: boolean,
    colorFillShape: string,
    colorStrokeShape: string,
    coordList: Coordonnees[]
  ) {
    super(Tools.Box, fill, stroke, colorFillShape, colorStrokeShape, coordList);
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
      if (ctx) {
        largeur = this.coordList[1].x - this.coordList[0].x;
        hauteur = this.coordList[1].y - this.coordList[0].y;

        if (this.fill && this.stroke) {
          ctx.fillStyle = this.colorFillShape;
          ctx.strokeStyle = this.colorStrokeShape;
          ctx.fillRect(
            this.coordList[0].x,
            this.coordList[0].y,
            largeur,
            hauteur
          );
          ctx.strokeRect(
            this.coordList[0].x,
            this.coordList[0].y,
            largeur,
            hauteur
          );
        } else if (this.fill) {
          ctx.fillStyle = this.colorFillShape;
          ctx.fillRect(
            this.coordList[0].x,
            this.coordList[0].y,
            largeur,
            hauteur
          );
        } else if (this.stroke) {
          ctx.strokeStyle = this.colorStrokeShape;
          ctx.strokeRect(
            this.coordList[0].x,
            this.coordList[0].y,
            largeur,
            hauteur
          );
        }
      }
    }
  }
}
