import { Component, ViewContainerRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Options } from '@angular-slider/ngx-slider';
import { FormControl } from '@angular/forms';
import { Shape } from '../shapes/Shape';
import { ShapeFactory } from '../shapes/ShapeFactory';
import { Layer } from '../layers/Layer';
import { LayerList } from '../layers/LayerList';
import { ActionsList } from '../actions/ActionsList';
import { LayerVisibility } from '../actions/LayerVisibility';
import { LayerDelete } from '../actions/LayerDelete';
import { LayerAdd } from '../actions/LayerAdd';
import { LayerSelect } from '../actions/LayerSelect';
import { DrawService } from '../services/DrawService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-option-bar',
  templateUrl: './option-bar.component.html',
  styleUrls: ['./option-bar.component.scss'],
})
export class OptionBarComponent {
  public fileName: string = '';
  public fillColor: string = '#000000';
  public strokeColor: string = '#000000';

  layerList: LayerList = new LayerList(new Layer(), '#FFFFFF');
  layerListSubscription: Subscription = new Subscription();

  actionList: ActionsList = new ActionsList();
  actionListSubscription: Subscription = new Subscription();

  constructor(
    public vcRef: ViewContainerRef,
    private toastr: ToastrService,
    private drawService: DrawService
  ) {}

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
    this.layerListSubscription = this.drawService.layerList.subscribe(
      (layerList: LayerList) => {
        this.layerList = layerList;
      }
    );
    this.actionListSubscription = this.drawService.actionList.subscribe(
      (actionList: ActionsList) => {
        this.actionList = actionList;
      }
    );
  }

  onValueChangeThickness(value: number) {
    this.thickness = value;
    this.thicknessInputValid = true;
    this.drawService.thickness = this.thickness;
  }

  ngOnDestroy() {
    this.layerListSubscription.unsubscribe();
    this.actionListSubscription.unsubscribe();
  }

  public onEventLogFill(data: any): void {
    this.drawService.colorFillShape = data.color;
  }

  public onEventLogStroke(data: any): void {
    this.drawService.colorStrokeShape = data.color;
  }

  public sendFileName() {
    if (this.fileName === '') {
      this.drawService.setFileName('Dessin');
    } else {
      this.drawService.setFileName(this.fileName);
    }
  }

  public toggleVisibility(layer: Layer) {
    let action = new LayerVisibility(layer);
    action.do(this.layerList);
    this.actionList.undoList.push(action);
    this.drawService.setActionList(this.actionList);
    this.drawService.setLayerList(this.layerList);
  }

  public deleteLayer(layer: Layer) {
    let action = new LayerDelete(layer);
    action.do(this.layerList);
    this.actionList.undoList.push(action);
    this.drawService.setActionList(this.actionList);
    this.drawService.setLayerList(this.layerList);
  }

  public addLayer() {
    let action = new LayerAdd();
    action.do(this.layerList);
    this.actionList.undoList.push(action);
    this.drawService.setActionList(this.actionList);
    this.drawService.setLayerList(this.layerList);
  }

  public selectLayer(layer: Layer) {
    if (layer.uuid !== this.layerList.selectedLayer.uuid) {
      let action = new LayerSelect(layer);
      action.do(this.layerList);
      this.actionList.undoList.push(action);
      this.drawService.setActionList(this.actionList);
      this.drawService.setLayerList(this.layerList);
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
      this.layerList = this.createLayerList(fileContent);
      this.drawService.setLayerList(this.layerList);
    };

    // Split the file name at the last occurrence of the dot to get the file name without the extension
    this.drawService.setFileName(file.name.split('.').slice(0, -1).join('.'));

    reader.readAsText(file);
    this.toastr.success('Import de ' + this.fileName + ' réussi !');
  }

  createLayerList(fileContent: LayerList): LayerList {
    let list: LayerList = new LayerList(
      new Layer(),
      fileContent.backgroundColor
    );
    list.layerList.pop();
    fileContent.layerList.forEach((elementLayer) => {
      let shapeListTmp: Shape[] = [];
      elementLayer.shapeList.forEach((element) => {
        let shape: Shape | null = ShapeFactory(
          element.type,
          element.parameters.thickness,
          element.parameters.colorFillShape,
          element.parameters.colorStrokeShape,
          element.parameters.coordList,
          element.parameters.scaleFactor,
          element.parameters.rotateAngle
        );
        if (shape !== null) {
          shapeListTmp.push(shape);
        }
      });
      list.layerList.push(
        new Layer(shapeListTmp, elementLayer.isVisible, elementLayer.uuid)
      );
    });
    list.selectedLayer = list.layerList[0];

    return list;
  }

  export() {
    const jsonData = JSON.stringify(this.layerList);

    let blob = new Blob(['\ufeff' + jsonData], {
      type: 'application/json;charset=utf-8;',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display:none');
    a.href = url;
    if (this.fileName == '') {
      a.download = 'Dessin.anguille';
    } else {
      a.download = this.fileName + '.anguille';
    }

    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    this.toastr.success('Export Réussi !');
  }
}
