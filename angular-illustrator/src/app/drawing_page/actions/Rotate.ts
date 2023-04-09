import { LayerList } from '../layers/LayerList';
import { Coordonnees, Shape } from '../shapes/Shape';
import { Action } from './Action';

export class Rotate extends Action {
  shape: Shape;
  initialRotateAngle: number;
  initialCoord: Coordonnees;
  coordSelected: Coordonnees;

  constructor(shape: Shape, coordSelected: Coordonnees) {
    super();
    this.shape = shape;
    this.initialRotateAngle = shape.parameters.rotateAngle;
    this.initialCoord = coordSelected;
    this.coordSelected = coordSelected;
  }

  override previsu(coord: Coordonnees): void {
    var multiplicator = Math.sqrt(
      Math.pow(this.initialCoord.x - coord.x, 2) +
        Math.pow(this.initialCoord.y - coord.y, 2)
    );
    if (this.initialCoord.x - coord.x > 0) multiplicator = -multiplicator;

    this.coordSelected = new Coordonnees(coord.x, coord.y);
    this.shape.parameters.rotateAngle = this.initialRotateAngle + multiplicator;
    this.shape.draw();
  }

  override do(layerList: LayerList): LayerList {
    this.previsu(this.coordSelected);
    return layerList;
  }

  override undo(layerList: LayerList): LayerList {
    this.shape.parameters.rotateAngle = this.initialRotateAngle;
    return layerList;
  }
}
