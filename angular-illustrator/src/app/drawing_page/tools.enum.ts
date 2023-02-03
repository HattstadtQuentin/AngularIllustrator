export enum Tools {
  Select = 'Select',
  Selection = 'Selection',
  Draw = 'Draw',
  Line = 'Line',
  Box = 'Box',
  Circle = 'Circle',
  Triangle = 'Triangle',
  Eraser = 'Eraser'
}

interface ToolsMap {
  [key: string]: Tools;
}

export const toolsMap: { [key: string]: Tools } = {
  Select: Tools.Select,
  Selection: Tools.Selection,
  Draw: Tools.Draw,
  Line: Tools.Line,
  Box: Tools.Box,
  Circle: Tools.Circle,
  Triangle: Tools.Triangle,
  Eraser: Tools.Eraser
};
