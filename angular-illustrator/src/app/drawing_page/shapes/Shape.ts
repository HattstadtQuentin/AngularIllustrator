export class Shape {
  fill: boolean; //La forme à un remplissage : true/false
  stroke: boolean; //La forme à des contours : true/false
  colorFillShape: string; //Couleur de remplissage s'il y en a une
  colorStrokeShape: string;
  coordList: Coordonnees[];

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
  }

  draw(x: number, y: number, type: number, prevision: boolean): void {}
}

export class Coordonnees {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
