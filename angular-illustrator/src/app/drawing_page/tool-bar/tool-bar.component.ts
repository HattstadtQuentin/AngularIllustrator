import { Component, EventEmitter, Output } from '@angular/core';
import { Tools, toolsMap } from '../tools.enum';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent {
  activeTool = Tools.Line;
  Tools = Tools;
  @Output() update = new EventEmitter<Tools>();

  setActiveTool(tool : Tools) {
    this.activeTool = tool;
    this.update.emit(this.activeTool);
  }

  filteredTools = Object.values(Tools);
  updateFilteredTools(value: string[]) {
     this.filteredTools = value.map(val => toolsMap[val]);
  }
}
