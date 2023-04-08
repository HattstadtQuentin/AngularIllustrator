import { Shape } from '../shapes/Shape';
import { Action } from './Action';

export class Fill extends Action {
  shape: Shape;
  beforeColor: string;
  afterColor: string;

  constructor(shape: Shape, afterColor: string) {
    super();
    this.shape = shape;
    this.beforeColor = '#fff';
    this.afterColor = afterColor;
  }

  override do(shapeList: Shape[]): Shape[] {
    this.beforeColor = this.shape.colorFillShape;
    this.shape.colorFillShape = this.afterColor;
    return shapeList;
  }

  override undo(shapeList: Shape[]): Shape[] {
    this.shape.colorFillShape = this.beforeColor;
    return shapeList;
  }
}
