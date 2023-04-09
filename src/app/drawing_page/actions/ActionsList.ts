import { LayerList } from '../layers/LayerList';
import { Action } from './Action';

export class ActionsList {
  undoList: Action[];
  redoList: Action[];
  dateUpdated: number;

  constructor() {
    this.undoList = [];
    this.redoList = [];
    this.dateUpdated = Date.now();
  }

  undo(layerList: LayerList): LayerList {
    let action = this.undoList.pop();
    if (action !== undefined) {
      this.redoList.push(action);
      return action.undo(layerList);
    }
    return layerList;
  }

  redo(layerList: LayerList): LayerList {
    let action = this.redoList.pop();

    if (action !== undefined) {
      this.undoList.push(action);
      return action.do(layerList);
    }

    return layerList;
  }
}
