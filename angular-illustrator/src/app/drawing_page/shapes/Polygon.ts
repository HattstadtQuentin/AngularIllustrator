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
    const center = { x: 0, y: 0 };
    for (let i = 0; i < this.parameters.coordList.length; i++) {
      center.x += this.parameters.coordList[i].x;
      center.y += this.parameters.coordList[i].y;
    }
    center.x /= this.parameters.coordList.length;
    center.y /= this.parameters.coordList.length;
    return new Coordonnees(center.x, center.y);
  }

  override intersect(coord: Coordonnees): boolean {
    let isInside = false;

    // Calculate the center point of the polygon
    const center = this.center();

    // Translate the polygon so that its center is at the origin
    const translatedPolygon = this.parameters.coordList.map((p) => {
      return { x: p.x - center.x, y: p.y - center.y };
    });

    // Rotate the polygon
    const rotatedPolygon = translatedPolygon.map((p) => {
      const x =
        p.x * Math.cos(this.parameters.rotateAngle) -
        p.y * Math.sin(this.parameters.rotateAngle);
      const y =
        p.x * Math.sin(this.parameters.rotateAngle) +
        p.y * Math.cos(this.parameters.rotateAngle);
      return { x, y };
    });

    // Scale the polygon
    const scaledPolygon = rotatedPolygon.map((p) => {
      const x = p.x * this.parameters.scaleFactor;
      const y = p.y * this.parameters.scaleFactor;
      return { x, y };
    });

    // Translate the polygon back to its original position
    const coordListTmp = scaledPolygon.map((p) => {
      return { x: p.x + center.x, y: p.y + center.y };
    });

    const n = coordListTmp.length;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const xi = coordListTmp[i].x;
      const yi = coordListTmp[i].y;
      const xj = coordListTmp[j].x;
      const yj = coordListTmp[j].y;
      const intersect =
        yi > coord.y !== yj > coord.y &&
        coord.x < ((xj - xi) * (coord.y - yi)) / (yj - yi) + xi;
      if (intersect) {
        isInside = !isInside;
      }
    }
    return isInside;
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
        ctx.fillStyle = this.parameters.colorFillShape;
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
        if (this.isClosed) {
          ctx.closePath();

          ctx.fill();
        }
        ctx.stroke();

        ctx.restore();
      }
    }
  }
}
