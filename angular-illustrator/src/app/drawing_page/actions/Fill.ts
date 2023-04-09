import { LayerList } from '../layers/LayerList';
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

  override do(layerList: LayerList): LayerList {
    this.beforeColor = this.shape.parameters.colorFillShape;
    this.shape.parameters.colorFillShape = this.afterColor;
    return layerList;
  }

  override undo(layerList: LayerList): LayerList {
    this.shape.parameters.colorFillShape = this.beforeColor;
    return layerList;
  }
}
