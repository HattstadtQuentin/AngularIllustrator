export enum Tools {
  Selection = 'Selection',
  Move = 'Move',
  Scale = 'Scale',
  Fill = 'Fill',
  Pen = 'Pen',
  Line = 'Line',
  Box = 'Box',
  Circle = 'Circle',
  Polygon = 'Polygon',
  Eraser = 'Eraser',
  Delete = 'Delete',
}

interface ToolsMap {
  [key: string]: Tools;
}

export const toolsMap: { [key: string]: Tools } = {
  Selection: Tools.Selection,
  Move: Tools.Move,
  Scale: Tools.Scale,
  Fill: Tools.Fill,
  Pen: Tools.Pen,
  Line: Tools.Line,
  Box: Tools.Box,
  Circle: Tools.Circle,
  Polygon: Tools.Polygon,
  Eraser: Tools.Eraser,
  Delete: Tools.Delete,
};
