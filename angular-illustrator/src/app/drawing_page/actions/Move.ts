import { Coordonnees, Shape } from '../shapes/Shape';
import { Action } from './Action';

export class Move extends Action {
  shape: Shape;
  coordSelected: Coordonnees;

  constructor(shape: Shape, coordSelected: Coordonnees) {
    super();
    this.shape = shape;
    this.coordSelected = coordSelected;
  }

  override previsu(coord: Coordonnees): void {
    const offsetX = this.coordSelected.x - coord.x;
    const offsetY = this.coordSelected.y - coord.y;
    this.shape.move(offsetX, offsetY);
    this.coordSelected = coord;
    this.shape.draw();
  }

  override do(shapeList: Shape[]): Shape[] {
    this.shape.isSelected = false;
    return shapeList;
  }

  override undo(shapeList: Shape[]): Shape[] {
    const filteredArr = shapeList.filter(
      (item) => item.uuid !== this.shape.uuid
    );

    return filteredArr;
  }
}
