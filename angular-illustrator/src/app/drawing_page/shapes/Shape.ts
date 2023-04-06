import { v4 as uuidv4 } from 'uuid';

export class Shape {
  fill: boolean; //La forme à un remplissage : true/false
  stroke: boolean; //La forme à des contours : true/false
  colorFillShape: string; //Couleur de remplissage s'il y en a une
  colorStrokeShape: string;
  coordList: Coordonnees[];
  uuid: string;

  constructor(
    fill: boolean,
    stroke: boolean,
    colorFillShape: string,
    colorStrokeShape: string,
    coordList: Coordonnees[]
  ) {
    this.fill = fill;
    this.stroke = stroke;
    this.colorFillShape = colorFillShape;
    this.colorStrokeShape = colorStrokeShape;
    this.coordList = coordList;
    this.uuid = uuidv4();
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
