import { Layer } from './Layer';

export class LayerList {
  layerList: Layer[];
  selectedLayer: Layer;
  backgroundColor: string;

  constructor(layer: Layer, backgroundColor: string) {
    this.layerList = [layer];
    this.selectedLayer = layer;
    this.backgroundColor = backgroundColor;
  }
}
