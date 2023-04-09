import { Tools } from '../tools.enum';
import { Circle } from './Circle';
import { Line } from './Line';
import { Pen } from './Pen';
import { Rect } from './Rect';
import { Coordonnees, Shape, ShapeParameters } from './Shape';
import { Polygon } from './Polygon';
import { Eraser } from './Eraser';

export function ShapeFactory(
  type: Tools,
  thickness: number,
  colorFillShape: string,
  colorStrokeShape: string,
  coordList: Coordonnees[]
): Shape | null {
  const parameters = new ShapeParameters(
    thickness,
    colorFillShape,
    colorStrokeShape,
    coordList
  );
  switch (type) {
    case Tools.Pen:
      return new Pen(parameters);
    case Tools.Line:
      return new Line(parameters);
    case Tools.Box:
      return new Rect(parameters);
    case Tools.Circle:
      return new Circle(parameters);
    case Tools.Polygon:
      return new Polygon(parameters);
    case Tools.Eraser:
      return new Eraser(parameters);
    default:
      return null;
  }
}
