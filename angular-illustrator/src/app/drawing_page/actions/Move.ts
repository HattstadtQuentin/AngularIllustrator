import { Coordonnees, Shape } from '../shapes/Shape';
import { Action } from './Action';

export class Move extends Action {
  shape: Shape;
  coordSelected: Coordonnees;
  beforeCoord: Coordonnees | null;
  afterCoord: Coordonnees | null;

  constructor(shape: Shape, coordSelected: Coordonnees) {
    super();
    this.shape = shape;
    this.coordSelected = coordSelected;
    this.beforeCoord = null;
    this.afterCoord = null;
  }

  override previsu(coord: Coordonnees): void {
    if (this.beforeCoord === null) {
      this.beforeCoord = new Coordonnees(
        this.shape.coordList[0].x,
        this.shape.coordList[0].y
      );
    }
    const offsetX = this.coordSelected.x - coord.x;
    const offsetY = this.coordSelected.y - coord.y;
    this.shape.move(offsetX, offsetY);
    this.coordSelected = new Coordonnees(coord.x, coord.y);
    this.shape.draw();
  }

  override do(ShapeList: Shape[]): Shape[] {
    const arrivalCoord = this.coordSelected;
    this.coordSelected = this.shape.coordList[0];
    this.previsu(arrivalCoord);
    return ShapeList;
  }

  override undo(shapeList: Shape[]): Shape[] {
    if (this.beforeCoord !== null) {
      const offsetX = this.shape.coordList[0].x - this.beforeCoord.x;
      const offsetY = this.shape.coordList[0].y - this.beforeCoord.y;
      this.shape.move(offsetX, offsetY);
      this.shape.draw();
    }
    return shapeList;
  }
}
