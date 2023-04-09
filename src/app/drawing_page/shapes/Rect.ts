import { Tools } from '../tools.enum';
import { Coordonnees, Shape, ShapeParameters } from './Shape';

export class Rect extends Shape {
  constructor(parameters: ShapeParameters) {
    super(Tools.Box, parameters);
  }

  override center(): Coordonnees {
    const centerX =
      (this.parameters.coordList[0].x + this.parameters.coordList[1].x) / 2;
    const centerY =
      (this.parameters.coordList[0].y + this.parameters.coordList[1].y) / 2;
    return new Coordonnees(centerX, centerY);
  }

  override intersect(coord: Coordonnees): boolean {
    if (this.parameters.coordList.length < 2) {
      return false;
    }

    const width = Math.abs(
      this.parameters.coordList[1].x - this.parameters.coordList[0].x
    );
    const height = Math.abs(
      this.parameters.coordList[1].y - this.parameters.coordList[0].y
    );
    const centerX =
      (this.parameters.coordList[0].x + this.parameters.coordList[1].x) / 2;
    const centerY =
      (this.parameters.coordList[0].y + this.parameters.coordList[1].y) / 2;

    const scaledWidth = width * this.parameters.scaleFactor;
    const scaledHeight = height * this.parameters.scaleFactor;

    const angle = (this.parameters.rotateAngle * Math.PI) / 180;
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    const topLeftX = centerX - scaledWidth / 2;
    const topLeftY = centerY - scaledHeight / 2;
    const topRightX = centerX + scaledWidth / 2;
    const topRightY = centerY - scaledHeight / 2;
    const bottomLeftX = centerX - scaledWidth / 2;
    const bottomLeftY = centerY + scaledHeight / 2;
    const bottomRightX = centerX + scaledWidth / 2;
    const bottomRightY = centerY + scaledHeight / 2;

    const rotatedTopLeftX =
      centerX +
      cosAngle * (topLeftX - centerX) -
      sinAngle * (topLeftY - centerY);
    const rotatedTopLeftY =
      centerY +
      sinAngle * (topLeftX - centerX) +
      cosAngle * (topLeftY - centerY);
    const rotatedTopRightX =
      centerX +
      cosAngle * (topRightX - centerX) -
      sinAngle * (topRightY - centerY);
    const rotatedTopRightY =
      centerY +
      sinAngle * (topRightX - centerX) +
      cosAngle * (topRightY - centerY);
    const rotatedBottomLeftX =
      centerX +
      cosAngle * (bottomLeftX - centerX) -
      sinAngle * (bottomLeftY - centerY);
    const rotatedBottomLeftY =
      centerY +
      sinAngle * (bottomLeftX - centerX) +
      cosAngle * (bottomLeftY - centerY);
    const rotatedBottomRightX =
      centerX +
      cosAngle * (bottomRightX - centerX) -
      sinAngle * (bottomRightY - centerY);
    const rotatedBottomRightY =
      centerY +
      sinAngle * (bottomRightX - centerX) +
      cosAngle * (bottomRightY - centerY);

    const minX = Math.min(
      rotatedTopLeftX,
      rotatedTopRightX,
      rotatedBottomLeftX,
      rotatedBottomRightX
    );
    const maxX = Math.max(
      rotatedTopLeftX,
      rotatedTopRightX,
      rotatedBottomLeftX,
      rotatedBottomRightX
    );
    const minY = Math.min(
      rotatedTopLeftY,
      rotatedTopRightY,
      rotatedBottomLeftY,
      rotatedBottomRightY
    );
    const maxY = Math.max(
      rotatedTopLeftY,
      rotatedTopRightY,
      rotatedBottomLeftY,
      rotatedBottomRightY
    );

    if (
      coord.x < minX - this.parameters.thickness ||
      coord.x > maxX + this.parameters.thickness ||
      coord.y < minY - this.parameters.thickness ||
      coord.y > maxY + this.parameters.thickness
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
        ctx.save();
        const center = this.center();
        ctx.translate(center.x, center.y);
        ctx.scale(this.parameters.scaleFactor, this.parameters.scaleFactor);
        ctx.rotate((this.parameters.rotateAngle * Math.PI) / 180);
        ctx.translate(-center.x, -center.y);
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

        ctx.restore();
      }
    }
  }
}
