import { Shape } from '../shapes/Shape';
import { Action } from './Action';

export class Delete extends Action {
  shape: Shape;

  constructor(shape: Shape) {
    super();
    this.shape = shape;
  }

  override do(shapeList: Shape[]): Shape[] {
    const filteredArr = shapeList.filter(
      (item) => item.uuid !== this.shape.uuid
    );
    return filteredArr;
  }

  override undo(shapeList: Shape[]): Shape[] {
    shapeList.push(this.shape);
    return shapeList;
  }
}
