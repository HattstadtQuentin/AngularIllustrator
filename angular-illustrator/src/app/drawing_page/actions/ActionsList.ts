import { Shape } from '../shapes/Shape';
import { Action } from './Action';

export class ActionsList {
  undoList: Action[];
  redoList: Action[];

  constructor() {
    this.undoList = [];
    this.redoList = [];
  }

  undo(shapeList: Shape[]): Shape[] {
    let action = this.undoList.pop();
    if (action !== undefined) {
      this.redoList.push(action);
      return action.undo(shapeList);
    }
    return shapeList;
  }

  redo(shapeList: Shape[]): Shape[] {
    let action = this.redoList.pop();

    if (action !== undefined) {
      this.undoList.push(action);
      return action.do(shapeList);
    }

    return shapeList;
  }
}
