import { Tools } from '../tools.enum';
import { Circle } from './Circle';
import { Line } from './Line';
import { Rect } from './Rect';
import { Coordonnees, Shape } from './Shape';
import { Triangle } from './Triangle';

export function ShapeFactory(
  type: Tools,
  fill: boolean,
  stroke: boolean,
  colorFillShape: string,
  colorStrokeShape: string,
  coordList: Coordonnees[]
): Shape | null {
  switch (type) {
    case Tools.Line:
      return new Line(
        fill,
        stroke,
        colorFillShape,
        colorStrokeShape,
        coordList
      );

    case Tools.Box:
      return new Rect(
        fill,
        stroke,
        colorFillShape,
        colorStrokeShape,
        coordList
      );

    case Tools.Circle:
      return new Circle(
        fill,
        stroke,
        colorFillShape,
        colorStrokeShape,
        coordList
      );
    case Tools.Triangle:
      return new Triangle(
        fill,
        stroke,
        colorFillShape,
        colorStrokeShape,
        coordList
      );
    default:
      return null;
  }
}
