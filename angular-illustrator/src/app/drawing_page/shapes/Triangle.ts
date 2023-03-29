import { Coordonnees, Shape } from './Shape';

export class Triangle extends Shape {
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
      this.coordList.push(new Coordonnees(x, y));
    }

    if (this.coordList.length == 3 || type == 1) {
      if (ctx) {
        ctx.beginPath();

        if (this.fill && this.stroke) {
          ctx.fillStyle = this.colorFillShape;
          ctx.strokeStyle = this.colorStrokeShape;
          ctx.moveTo(this.coordList[0].x, this.coordList[0].y);
          ctx.lineTo(this.coordList[1].x, this.coordList[1].y);
          ctx.lineTo(this.coordList[2].x, this.coordList[2].y);
          ctx.lineTo(this.coordList[0].x, this.coordList[0].y);
          ctx.fill();
          ctx.stroke();
        } else if (this.fill) {
          ctx.fillStyle = this.colorFillShape;
          ctx.moveTo(this.coordList[0].x, this.coordList[0].y);
          ctx.lineTo(this.coordList[1].x, this.coordList[1].y);
          ctx.lineTo(this.coordList[2].x, this.coordList[2].y);
          ctx.fill();
        } else if (this.stroke) {
          ctx.strokeStyle = this.colorStrokeShape;
          ctx.moveTo(this.coordList[0].x, this.coordList[0].y);
          ctx.lineTo(this.coordList[1].x, this.coordList[1].y);
          ctx.lineTo(this.coordList[2].x, this.coordList[2].y);
          ctx.lineTo(this.coordList[0].x, this.coordList[0].y);
          ctx.stroke();
        }
      }
    }
  }
}
