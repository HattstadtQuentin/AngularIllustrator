import { Component, Input, Output } from '@angular/core';
import { Shape } from './shapes/Shape';
import { Tools } from './tools.enum';

@Component({
  selector: 'app-drawing-page',
  templateUrl: './drawing-page.component.html',
  styleUrls: ['./drawing-page.component.scss'],
})
export class DrawingPageComponent {
  activeTool = Tools.Line;
  @Output() fileName = 'Dessin';
  drawZoneBackgroundColor = '#1A1F39';
  drawFillColor = '#000000';
  drawStrokeColor = '#000000';
  shapeList: Shape[] = [];

  updateActiveTool(value: Tools) {
    this.activeTool = value;
  }

  updateFileName(value: string) {
    if (value === '') {
      this.fileName = 'Dessin';
    } else {
      this.fileName = value;
    }
  }

  updateDrawZoneBackgroundColor(value: string) {
    this.drawZoneBackgroundColor = value;
  }

  updateFillColor(value: string) {
    this.drawFillColor = value;
  }

  updateStrokeColor(value: string) {
    this.drawStrokeColor = value;
  }

  updateShapeList(value: Shape[]) {
    this.shapeList = value;
  }
}
