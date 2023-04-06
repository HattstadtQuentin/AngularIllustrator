import { Coordonnees, Shape } from '../shapes/Shape';

export class Action {
  constructor() {}

  previsu(coord: Coordonnees): void {}

  do(shapeList: Shape[]): Shape[] {
    return shapeList;
  }

  undo(shapeList: Shape[]): Shape[] {
    return shapeList;
  }
}
