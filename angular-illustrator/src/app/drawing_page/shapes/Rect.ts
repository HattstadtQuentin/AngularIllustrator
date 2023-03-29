import { Coordonnees, Shape } from './Shape';

export class Rect extends Shape {
  override draw(x: number, y: number, type: number, prevision: boolean): void {
    let canvas: HTMLCanvasElement = document.getElementById(
      'drawingContainer'
    )! as HTMLCanvasElement;
    if (prevision) {
      canvas = document.getElementById(
        'previsualisationContainer'
      )! as HTMLCanvasElement;
    }
    const ctx = canvas.getContext('2d');

    if (type == 0) {
      if (this.coordList.length == 2) {
        this.coordList.pop();
      }
      this.coordList.push(new Coordonnees(x, y));
    }

    if (this.coordList.length == 2 || type == 1) {
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
