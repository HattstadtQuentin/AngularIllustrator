import {
  Component,
  ViewContainerRef,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Options } from '@angular-slider/ngx-slider';
import { FormControl } from '@angular/forms';
import { Shape } from '../shapes/Shape';
import { ShapeFactory } from '../shapes/ShapeFactory';

@Component({
  selector: 'app-option-bar',
  templateUrl: './option-bar.component.html',
  styleUrls: ['./option-bar.component.scss'],
})
export class OptionBarComponent {
  @Output() fileName = '';
  fillColor: string = '#000000';
  strokeColor: string = '#000000';
  @Output() updateFillColor = new EventEmitter<string>();
  @Output() updateStrokeColor = new EventEmitter<string>();
  @Output() updateThickness = new EventEmitter<number>();
  @Output() updateFileName = new EventEmitter<string>();

  @Input() public shapeList: Shape[];
  @Output() updateShapeList: EventEmitter<Shape[]> = new EventEmitter<
    Shape[]
  >();

  @Input() public drawShapeList: Function;

  constructor(public vcRef: ViewContainerRef, private toastr: ToastrService) {
    this.shapeList = [];
    this.drawShapeList = function (): void {};
  }

  public onEventLogFill(data: any): void {
    this.updateFillColor.emit(data.color);
  }

  public onEventLogStroke(data: any): void {
    this.updateStrokeColor.emit(data.color);
  }

  public sendFileName() {
    this.updateFileName.emit(this.fileName);
  }

  showIsCopied() {
    this.toastr.success('Copié dans le presse-papier');
  }

  import(event: any) {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const fileContent = JSON.parse(e.target.result);
      this.shapeList = this.createShapeList(fileContent);
      this.updateShapeList.emit(this.shapeList);
    };

    // Split the file name at the last occurrence of the dot to get the file name without the extension
    this.fileName = file.name.split('.').slice(0, -1).join('.');
    this.updateFileName.emit(this.fileName);

    reader.readAsText(file);
    this.toastr.success('Import de ' + this.fileName + ' réussi !');
  }

  createShapeList(fileContent: Shape[]): Shape[] {
    let list: Shape[] = [];
    fileContent.forEach((element) => {
      let shape: Shape | null = ShapeFactory(
        element.type,
        element.parameters.thickness,
        element.parameters.colorFillShape,
        element.parameters.colorStrokeShape,
        element.parameters.coordList
      );
      if (shape !== null) {
        list.push(shape);
      }
    });
    return list;
  }

  export() {
    if (this.shapeList.length === 0) {
      this.toastr.error("Il n'y a rien a exporter");
    } else {
      const jsonData = JSON.stringify(this.shapeList);

      let blob = new Blob(['\ufeff' + jsonData], {
        type: 'application/json;charset=utf-8;',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display:none');
      a.href = url;
      if (this.fileName == '') {
        a.download = 'dessin.anguille';
      } else {
        a.download = this.fileName + '.anguille';
      }

      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.toastr.success('Export Réussi !');
    }
  }

  optionsSlider: Options = {
    floor: 1,
    ceil: 50,
  };
  thickness: number = 1;

  formControlThickness = new FormControl();
  thicknessInputValid = true;
  ngOnInit() {
    this.formControlThickness.valueChanges.subscribe((x) => {
      if (x === null) {
        this.thicknessInputValid = false;
      } else {
        this.thicknessInputValid = true;
        this.thickness = x;
      }
    });
  }

  onValueChangeThickness(value: number) {
    this.thickness = value;
    this.thicknessInputValid = true;
    this.updateThickness.emit(this.thickness);
  }
}
