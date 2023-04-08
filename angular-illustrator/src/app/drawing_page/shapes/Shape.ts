import { v4 as uuidv4 } from 'uuid';
import { Tools } from '../tools.enum';

export class Shape {
  type: Tools;
  fill: boolean; //La forme à un remplissage : true/false
  stroke: boolean; //La forme à des contours : true/false
  colorFillShape: string; //Couleur de remplissage s'il y en a une
  colorStrokeShape: string;
  coordList: Coordonnees[];
  isSelected: boolean;
  uuid: string;

  constructor(
    type: Tools,
    fill: boolean,
    stroke: boolean,
    colorFillShape: string,
    colorStrokeShape: string,
    coordList: Coordonnees[]
  ) {
    this.type = type;
    this.fill = fill;
    this.stroke = stroke;
    this.colorFillShape = colorFillShape;
    this.colorStrokeShape = colorStrokeShape;
    this.coordList = coordList;
    this.isSelected = false;
    this.uuid = uuidv4();
  }

  move(xOffset: number, yOffset: number) {
    this.coordList.forEach((coord) => {
      coord.x = Math.floor(coord.x - xOffset);
      coord.y = Math.floor(coord.y - yOffset);
    });
  }

  intersect(coord: Coordonnees): boolean {
    return false;
  }

  previsu(coord: Coordonnees): void {}

  draw(): void {}
}

export class Coordonnees {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
