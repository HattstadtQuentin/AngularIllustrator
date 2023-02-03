import { Component, Input } from '@angular/core';
import { Tools } from './tools.enum';

@Component({
  selector: 'app-drawing-page',
  templateUrl: './drawing-page.component.html',
  styleUrls: ['./drawing-page.component.scss']
})
export class DrawingPageComponent {
  activeTool = Tools.Line;
  drawZoneBackgroundColor = '#1A1F39';

  updateActiveTool(value: Tools) {
    this.activeTool = value;
  }

  updateDrawZoneBackgroundColor(value: string) {
    this.drawZoneBackgroundColor = value;
  }

}
