import { Shape } from '../shapes/Shape';

export class Layer {
  shapeList: Shape[];
  isVisible: boolean;
  uuid: number;

  constructor(
    shapeList: Shape[] = [],
    isVisible: boolean = true,
    uuid: number = Date.now()
  ) {
    this.shapeList = shapeList;
    this.isVisible = isVisible;
    this.uuid = uuid;
  }
}
