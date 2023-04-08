import {
  Component,
  ViewContainerRef,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Options } from '@angular-slider/ngx-slider';
import { PaperSizes } from '../paperSizes.enum';
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
  color: string = '#1A1F39';
  fillColor: string = '#000000';
  strokeColor: string = '#000000';
  options = Object.values(PaperSizes).map((size) => {
    return `${size.title}(${size.description})`;
  });
  selectedOption = PaperSizes.A4.title + '(' + PaperSizes.A4.description + ')';
  @Output() updateBackgroundColor = new EventEmitter<string>();
  @Output() updateFillColor = new EventEmitter<string>();
  @Output() updateStrokeColor = new EventEmitter<string>();
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

  public onEventLog(event: string, data: any): void {
    if (event == 'colorPickerClose' && typeof data === 'string') {
      this.updateBackgroundColor.emit(data);
    }
  }

  public onEventLogFill(event: string, data: any): void {
    if (event == 'colorPickerClose' && typeof data === 'string') {
      this.updateFillColor.emit(data);
    }
  }

  public onEventLogStroke(event: string, data: any): void {
    if (event == 'colorPickerClose' && typeof data === 'string') {
      this.updateStrokeColor.emit(data);
    }
  }

  public sendFileName() {
    this.updateFileName.emit(this.fileName);
  }

  updatePaperSelection(event: Event) {
    if (event.target instanceof HTMLSelectElement) {
      this.selectedOption = event.target.value;
    }
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
        element.parameters.fill,
        element.parameters.stroke,
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
    floor: 0,
    ceil: 50,
  };
  thickness: number = 25;

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
  }
}
