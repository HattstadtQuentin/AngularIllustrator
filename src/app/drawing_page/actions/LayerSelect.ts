import { Layer } from '../layers/Layer';
import { LayerList } from '../layers/LayerList';
import { Action } from './Action';

export class LayerSelect extends Action {
  layer: Layer;
  previousLayer: Layer | null;
  constructor(layer: Layer) {
    super();
    this.layer = layer;
    this.previousLayer = null;
  }

  override do(layerList: LayerList): LayerList {
    if (this.previousLayer === null) {
      this.previousLayer = layerList.selectedLayer;
    }
    layerList.selectedLayer = this.layer;
    return layerList;
  }

  override undo(layerList: LayerList): LayerList {
    if (this.previousLayer !== null) {
      layerList.selectedLayer = this.previousLayer;
    }
    return layerList;
  }
}
