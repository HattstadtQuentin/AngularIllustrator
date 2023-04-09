import { Tools } from '../tools.enum';

export class Shape {
  type: Tools;
  parameters: ShapeParameters;

  constructor(type: Tools, parameters: ShapeParameters) {
    this.type = type;
    this.parameters = parameters;
  }

  center(): Coordonnees {
    return new Coordonnees(0, 0);
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
  scaleFactor: number;
  rotateAngle: number;
  uuid: number;

  constructor(
    thickness: number,
    colorFillShape: string,
    colorStrokeShape: string,
    coordList: Coordonnees[],
    scaleFactor: number = 1,
    rotateAngle: number = 0
  ) {
    this.thickness = thickness;
    this.colorFillShape = colorFillShape;
    this.colorStrokeShape = colorStrokeShape;
    this.coordList = coordList;
    this.isSelected = false;
    this.scaleFactor = scaleFactor;
    this.rotateAngle = rotateAngle;
    this.uuid = Date.now();
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
