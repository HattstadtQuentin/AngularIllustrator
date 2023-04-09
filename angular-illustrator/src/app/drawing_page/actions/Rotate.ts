import { Coordonnees, Shape } from '../shapes/Shape';
import { Action } from './Action';

export class Rotate extends Action {
  shape: Shape;
  initialRotateAngle: number;
  coordSelected: Coordonnees;

  constructor(shape: Shape, coordSelected: Coordonnees) {
    super();
    this.shape = shape;
    this.initialRotateAngle = shape.parameters.scaleFactor;
    this.coordSelected = coordSelected;
  }

  override previsu(coord: Coordonnees): void {
    const center = this.shape.center();
    var multiplicator = Math.sqrt(
      Math.pow(center.x - coord.x, 2) + Math.pow(center.y - coord.y, 2)
    );
    if (center.x - coord.x > 0) multiplicator = -multiplicator;

    this.coordSelected = new Coordonnees(coord.x, coord.y);
    this.shape.parameters.rotateAngle = this.initialRotateAngle + multiplicator;
    this.shape.draw();
  }

  override do(ShapeList: Shape[]): Shape[] {
    this.previsu(this.coordSelected);
    return ShapeList;
  }

  override undo(shapeList: Shape[]): Shape[] {
    this.shape.parameters.scaleFactor = this.initialRotateAngle;
    return shapeList;
  }
}
