import { Layer } from '../layers/Layer';
import { LayerList } from '../layers/LayerList';
import { Action } from './Action';

export class LayerDelete extends Action {
  layer: Layer;
  constructor(layer: Layer) {
    super();
    this.layer = layer;
  }

  override do(layerList: LayerList): LayerList {
    const filteredArr = layerList.layerList.filter(
      (item) => item.uuid !== this.layer.uuid
    );
    layerList.layerList = filteredArr;
    layerList.selectedLayer =
      layerList.layerList[layerList.layerList.length - 1];
    return layerList;
  }

  override undo(layerList: LayerList): LayerList {
    layerList.layerList.push(this.layer);
    layerList.selectedLayer = this.layer;
    return layerList;
  }
}
