import { Layer } from '../layers/Layer';
import { LayerList } from '../layers/LayerList';
import { Action } from './Action';

export class LayerAdd extends Action {
  layer: Layer | null;
  constructor() {
    super();
    this.layer = null;
  }

  override do(layerList: LayerList): LayerList {
    if (this.layer === null) {
      this.layer = new Layer();
    }
    layerList.layerList.push(this.layer);
    layerList.selectedLayer = this.layer;
    return layerList;
  }

  override undo(layerList: LayerList): LayerList {
    if (this.layer !== null) {
      const filteredArr = layerList.layerList.filter(
        (item) => this.layer !== null && item.uuid !== this.layer.uuid
      );
      layerList.layerList = filteredArr;
      layerList.selectedLayer =
        layerList.layerList[layerList.layerList.length - 1];
    }
    return layerList;
  }
}
