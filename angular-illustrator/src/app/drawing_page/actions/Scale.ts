import { LayerList } from '../layers/LayerList';
import { Coordonnees, Shape } from '../shapes/Shape';
import { Action } from './Action';

export class Scale extends Action {
  shape: Shape;
  initialScaleFactor: number;
  coordSelected: Coordonnees;

  constructor(shape: Shape, coordSelected: Coordonnees) {
    super();
    this.shape = shape;
    this.initialScaleFactor = shape.parameters.scaleFactor;
    this.coordSelected = coordSelected;
  }

  override previsu(coord: Coordonnees): void {
    const center = this.shape.center();
    var distance = Math.sqrt(
      Math.pow(center.x - coord.x, 2) + Math.pow(center.y - coord.y, 2)
    );
    var multiplicator = distance / 100;
    if (center.x - coord.x > 0) multiplicator = -multiplicator;

    this.coordSelected = new Coordonnees(coord.x, coord.y);
    this.shape.parameters.scaleFactor = this.initialScaleFactor + multiplicator;
    this.shape.draw();
  }

  override do(layerList: LayerList): LayerList {
    this.previsu(this.coordSelected);
    return layerList;
  }

  override undo(layerList: LayerList): LayerList {
    this.shape.parameters.scaleFactor = this.initialScaleFactor;
    return layerList;
  }
}
