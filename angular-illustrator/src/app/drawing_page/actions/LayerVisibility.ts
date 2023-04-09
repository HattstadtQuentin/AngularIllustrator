import { Layer } from '../layers/Layer';
import { LayerList } from '../layers/LayerList';
import { Action } from './Action';

export class LayerVisibility extends Action {
  layer: Layer;
  constructor(layer: Layer) {
    super();
    this.layer = layer;
  }

  override do(layerList: LayerList): LayerList {
    this.layer.isVisible = !this.layer.isVisible;
    return layerList;
  }

  override undo(layerList: LayerList): LayerList {
    this.layer.isVisible = !this.layer.isVisible;
    return layerList;
  }
}
