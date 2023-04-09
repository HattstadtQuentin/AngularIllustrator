import { LayerList } from '../layers/LayerList';
import { Coordonnees } from '../shapes/Shape';

export class Action {
  constructor() {}

  previsu(coord: Coordonnees): void {}

  do(layerList: LayerList): LayerList {
    return layerList;
  }

  undo(layerList: LayerList): LayerList {
    return layerList;
  }
}
