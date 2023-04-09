import { v4 as uuidv4 } from 'uuid';
import { Tools } from '../tools.enum';

export class Shape {
  type: Tools;
  parameters: ShapeParameters;

  constructor(type: Tools, parameters: ShapeParameters) {
    this.type = type;
    this.parameters = parameters;
  }

  move(xOffset: number, yOffset: number) {
    this.parameters.coordList.forEach((coord) => {
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

//Class permettant de remplir plus facilement les parametres d'une forme
export class ShapeParameters {
  thickness: number; //Epaisseur des contours
  colorFillShape: string; //Couleur de remplissage s'il y en a une
  colorStrokeShape: string;
  coordList: Coordonnees[];
  isSelected: boolean;
  uuid: string;

  constructor(
    thickness: number,
    colorFillShape: string,
    colorStrokeShape: string,
    coordList: Coordonnees[]
  ) {
    this.thickness = thickness;
    this.colorFillShape = colorFillShape;
    this.colorStrokeShape = colorStrokeShape;
    this.coordList = coordList;
    this.isSelected = false;
    this.uuid = uuidv4();
  }
}

export class Coordonnees {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
