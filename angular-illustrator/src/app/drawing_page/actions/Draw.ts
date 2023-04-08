import { Coordonnees, Shape } from '../shapes/Shape';
import { Action } from './Action';

export class Draw extends Action {
  shape: Shape;

  constructor(shape: Shape) {
    super();
    this.shape = shape;
  }

  override previsu(coord: Coordonnees): void {
    this.shape.previsu(coord);
  }

  override do(shapeList: Shape[]): Shape[] {
    this.shape.draw();
    shapeList.push(this.shape);
    return shapeList;
  }

  override undo(shapeList: Shape[]): Shape[] {
    const filteredArr = shapeList.filter(
      (item) => item.parameters.uuid !== this.shape.parameters.uuid
    );

    return filteredArr;
  }
}
