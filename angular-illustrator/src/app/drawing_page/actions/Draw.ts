import { LayerList } from '../layers/LayerList';
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

  override do(layerList: LayerList): LayerList {
    this.shape.draw();
    layerList.selectedLayer.shapeList.push(this.shape);
    return layerList;
  }

  override undo(layerList: LayerList): LayerList {
    const filteredArr = layerList.selectedLayer.shapeList.filter(
      (item) => item.parameters.uuid !== this.shape.parameters.uuid
    );

    layerList.selectedLayer.shapeList = filteredArr;
    return layerList;
  }
}
