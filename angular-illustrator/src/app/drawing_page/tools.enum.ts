export enum Tools {
  Selection = 'Selection',
  Move = 'Move',
  Pen = 'Pen',
  Line = 'Line',
  Box = 'Box',
  Circle = 'Circle',
  Triangle = 'Triangle',
  Eraser = 'Eraser',
}

interface ToolsMap {
  [key: string]: Tools;
}

export const toolsMap: { [key: string]: Tools } = {
  Selection: Tools.Selection,
  Move: Tools.Move,
  Pen: Tools.Pen,
  Line: Tools.Line,
  Box: Tools.Box,
  Circle: Tools.Circle,
  Triangle: Tools.Triangle,
  Eraser: Tools.Eraser,
};
