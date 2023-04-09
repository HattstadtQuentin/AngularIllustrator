import { LayerList } from '../layers/LayerList';
import { Shape } from '../shapes/Shape';
import { Action } from './Action';

export class Delete extends Action {
  shape: Shape;

  constructor(shape: Shape) {
    super();
    this.shape = shape;
  }

  override do(layerList: LayerList): LayerList {
    const filteredArr = layerList.selectedLayer.shapeList.filter(
      (item) => item.parameters.uuid !== this.shape.parameters.uuid
    );
    layerList.selectedLayer.shapeList = filteredArr;
    return layerList;
  }

  override undo(layerList: LayerList): LayerList {
    layerList.selectedLayer.shapeList.push(this.shape);
    return layerList;
  }
}
