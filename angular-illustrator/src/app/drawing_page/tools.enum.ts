export enum Tools {
  Selection = 'Selection',
  Move = 'Move',
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
  Fill: Tools.Fill,
  Pen: Tools.Pen,
  Line: Tools.Line,
  Box: Tools.Box,
  Circle: Tools.Circle,
  Triangle: Tools.Polygon,
  Eraser: Tools.Eraser,
  Delete: Tools.Delete,
};
