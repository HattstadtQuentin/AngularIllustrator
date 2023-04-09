import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ActionsList } from '../actions/ActionsList';
import { Layer } from '../layers/Layer';
import { LayerList } from '../layers/LayerList';
import { Tools } from '../tools.enum';

@Injectable({
  providedIn: 'root',
})
export class DrawService {
  activeTool: Tools = Tools.Line;

  private actionListSubject = new Subject<ActionsList>();
  actionList = this.actionListSubject.asObservable();
  public setActionList(actionList: ActionsList) {
    this.actionListSubject.next(actionList);
  }

  private layerListSubject = new Subject<LayerList>();
  layerList = this.layerListSubject.asObservable();
  public setLayerList(layerList: LayerList) {
    this.layerListSubject.next(layerList);
  }

  private fileNameSubject = new Subject<string>();
  fileName = this.fileNameSubject.asObservable();
  public setFileName(name: string) {
    this.fileNameSubject.next(name);
  }

  //Attributs nécéssaire à la création d'une Shape
  colorFillShape: string = '#000000'; //Couleur de remplissage de la forme en cours de dessin
  colorStrokeShape: string = '#000000';
  thickness: number = 1; //Number : epaisseur du trait
}
