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

    const thickness = this.parameters.thickness;
    const coordList = this.parameters.coordList;

    // Calculate the midpoint of the line
    const midX = (coordList[0].x + coordList[1].x) / 2;
    const midY = (coordList[0].y + coordList[1].y) / 2;

    // Calculate the angle of the line with respect to the x-axis
    const angle = Math.atan2(
      coordList[1].y - coordList[0].y,
      coordList[1].x - coordList[0].x
    );

    // Rotate the point and the line about their center point
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    const rotatedCoord = {
      x: (coord.x - midX) * cosAngle - (coord.y - midY) * sinAngle + midX,
      y: (coord.x - midX) * sinAngle + (coord.y - midY) * cosAngle + midY,
    };

    const rotatedCoordList = coordList.map((coord) => ({
      x: (coord.x - midX) * cosAngle - (coord.y - midY) * sinAngle + midX,
      y: (coord.x - midX) * sinAngle + (coord.y - midY) * cosAngle + midY,
    }));

    // Calculate the distance between the point and the line
    const distance =
      Math.abs(
        (rotatedCoordList[1].y - rotatedCoordList[0].y) * rotatedCoord.x -
          (rotatedCoordList[1].x - rotatedCoordList[0].x) * rotatedCoord.y +
          rotatedCoordList[1].x * rotatedCoordList[0].y -
          rotatedCoordList[1].y * rotatedCoordList[0].x
      ) /
      Math.sqrt(
        Math.pow(rotatedCoordList[1].y - rotatedCoordList[0].y, 2) +
          Math.pow(rotatedCoordList[1].x - rotatedCoordList[0].x, 2)
      );

    // Calculate the scaled thickness of the line
    const scaleFactor = this.parameters.scaleFactor;
    const scaledThickness = thickness * scaleFactor;

    // Calculate the distance from the point to the midpoint of the line
    const distFromMid = Math.sqrt(
      Math.pow(coord.x - midX, 2) + Math.pow(coord.y - midY, 2)
    );

    // Calculate the scaled and rotated thickness of the line
    const scaledRotatedThickness = scaledThickness * Math.abs(Math.cos(angle));

    // Check if the point intersects with the line
    return (
      distance <= scaledRotatedThickness / 2 &&
      distFromMid <=
        Math.sqrt(
          Math.pow(coordList[1].x - coordList[0].x, 2) +
            Math.pow(coordList[1].y - coordList[0].y, 2)
        ) /
          2
    );
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
