import { Coordonnees, Shape } from './Shape';

export class Line extends Shape {
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
      if (ctx) {
        ctx.strokeStyle = this.colorFillShape;
        ctx.moveTo(this.coordList[0].x, this.coordList[0].y);
        ctx.lineTo(this.coordList[1].x, this.coordList[1].y);
        ctx.stroke();
      }
    }
  }
}
