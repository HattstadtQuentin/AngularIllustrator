import { Component } from '@angular/core';
import { Tools } from './tools.enum';

@Component({
  selector: 'app-drawing-page',
  templateUrl: './drawing-page.component.html',
  styleUrls: ['./drawing-page.component.scss']
})
export class DrawingPageComponent {
  activeTool = Tools.Line;

  updateActiveTool(value: Tools) {
    this.activeTool = value;
  }

}
