import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  EventEmitter,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Tools } from '../tools.enum';
import { Polygon } from '../shapes/Polygon';
import { Circle } from '../shapes/Circle';
import { Rect } from '../shapes/Rect';
import { Line } from '../shapes/Line';
import { Coordonnees, Shape, ShapeParameters } from '../shapes/Shape';
import { ActionsList } from '../actions/ActionsList';
import { Draw } from '../actions/Draw';
import { Move } from '../actions/Move';
import { Action } from '../actions/Action';
import { Pen } from '../shapes/Pen';
import { Fill } from '../actions/Fill';
import { Delete } from '../actions/Delete';
import { Eraser } from '../shapes/Eraser';
import { Scale } from '../actions/Scale';
import { Rotate } from '../actions/Rotate';
import { Layer } from '../layers/Layer';
import { LayerList } from '../layers/LayerList';
import { DrawService } from '../services/DrawService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-drawing-zone',
  templateUrl: './drawing-zone.component.html',
  styleUrls: ['./drawing-zone.component.scss'],
})
export class DrawingZoneComponent implements OnInit {
  @ViewChild('canvas') canvasRef: ElementRef;
  @ViewChild('canvasPrevi') canvasPreviRef: ElementRef;

  //--------------------------------------------------------------------------------------
  // DECLARATION DES ATTRIBUTS
  //--------------------------------------------------------------------------------------
  //Attributs globaux
  public x: number; //Position x de la souris
  public y: number; //Position y de la souris
  public canvas?: HTMLCanvasElement;

  layerList: LayerList = new LayerList(new Layer(), '#FFFFFF');
  layerListSubscription: Subscription = new Subscription();

  actionList: ActionsList = new ActionsList();
  actionListSubscription: Subscription = new Subscription();

  public currentAction: Action | null;

  public isDrawing: boolean; //Boolean : dessin en cours
  public controlKeyPressed: boolean; //Boolean : la touche control est appuyé ou non, utilisé lors du undo redo
  public majKeyPressed: boolean; //Boolean : la touche maj est appuyé ou non, utilisé lors du redo

  //--------------------------------------------------------------------------------------
  // CONSTRUCTEUR
  //--------------------------------------------------------------------------------------
  constructor(
    private elementRef: ElementRef,
    private drawService: DrawService
  ) {
    this.x = 0;
    this.y = 0;
    this.canvasRef = new ElementRef(null);
    this.canvasPreviRef = new ElementRef(null);
    this.currentAction = null;

    this.isDrawing = false;
    this.controlKeyPressed = false;
    this.majKeyPressed = false;
  }

  //--------------------------------------------------------------------------------------
  //
  //--------------------------------------------------------------------------------------
  ngOnInit() {
    setTimeout(() => {
      this.drawLayers();
      window.addEventListener('resize', this.drawLayers.bind(this));
    });

    this.layerListSubscription = this.drawService.layerList.subscribe(
      (layerList: LayerList) => {
        this.layerList = layerList;
        this.drawLayers();
      }
    );
    this.actionListSubscription = this.drawService.actionList.subscribe(
      (actionList: ActionsList) => {
        this.actionList = actionList;
        this.drawLayers();
      }
    );
  }

  ngOnDestroy() {
    this.layerListSubscription.unsubscribe();
    this.actionListSubscription.unsubscribe();
  }

  //--------------------------------------------------------------------------------------
  //
  //--------------------------------------------------------------------------------------
  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));

    this.elementRef.nativeElement
      .querySelector('#drawingContainer')
      .addEventListener('mousedown', this.onMouseDown.bind(this));

    this.elementRef.nativeElement
      .querySelector('#drawingContainer')
      .addEventListener('mouseup', this.onMouseUp.bind(this));

    this.elementRef.nativeElement
      .querySelector('#drawingContainer')
      .addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'z' || event.key === 'Z') {
      if (this.majKeyPressed && this.controlKeyPressed) {
        this.layerList = this.actionList.redo(this.layerList);
        this.drawLayers();
      } else if (this.controlKeyPressed) {
        this.layerList = this.actionList.undo(this.layerList);
        this.drawLayers();
      }
    }

    if (event.key === 'Control' || event.key === 'Meta') {
      this.controlKeyPressed = true;
    }

    if (event.key === 'Shift') {
      this.majKeyPressed = true;
    }
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Control' || event.key === 'Meta') {
      this.controlKeyPressed = false;
    }

    if (event.key === 'Shift') {
      this.majKeyPressed = false;
    }
  }

  //--------------------------------------------------------------------------------------
  // METHODE onMouseDown : lié à l'event mouseDown
  //--------------------------------------------------------------------------------------
  public onMouseDown(e: MouseEvent): void {
    this.setMousePosition(e);
    this.actionHandler(new Coordonnees(this.x, this.y));
    this.isDrawing = true;
  }

  //--------------------------------------------------------------------------------------
  // METHODE onMouseMove : lié à l'event mouseMove, va dessiner la prévision de la forme
  //					   choisie en attendant que le bouton de souris soit relaché
  //--------------------------------------------------------------------------------------
  public onMouseMove(e: MouseEvent): void {
    if (this.isDrawing) {
      const canvas = this.canvasPreviRef.nativeElement as HTMLCanvasElement;
      const parent = canvas.parentElement as HTMLElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      }

      if (
        this.canvas &&
        this.canvas.parentElement &&
        this.canvas.parentElement.parentElement
      ) {
        this.x =
          e.clientX - this.canvas.parentElement?.parentElement.offsetLeft;
        this.y = e.clientY - this.canvas.parentElement?.parentElement.offsetTop;
      }

      if (this.currentAction !== null) {
        this.currentAction.previsu(new Coordonnees(this.x, this.y));
        if (
          this.currentAction instanceof Move ||
          this.currentAction instanceof Scale ||
          this.currentAction instanceof Rotate
        ) {
          this.drawLayers();
        }
        //Il est nécéssaire de redessiner toutes les formes lors de l'action gomme pour voir les modifications en temps réel.
        if (
          this.currentAction instanceof Draw &&
          this.currentAction.shape instanceof Eraser
        ) {
          if (
            !this.layerList.selectedLayer.shapeList.includes(
              this.currentAction.shape
            )
          ) {
            this.layerList.selectedLayer.shapeList.push(
              this.currentAction.shape
            );
          }
          this.drawLayers();
        }
      }
    }
  }

  //--------------------------------------------------------------------------------------
  // METHODE onMouseUp : lié à l'event mouseUp, va stopper les prévisions de la forme
  //					   		  choisie et va dessiner la forme
  //--------------------------------------------------------------------------------------
  public onMouseUp(e: MouseEvent): void {
    this.isDrawing = false;
    if (this.currentAction !== null) {
      this.layerList = this.currentAction.do(this.layerList);
      this.actionList.undoList.push(this.currentAction);
      this.currentAction = null;
      this.drawService.setActionList(this.actionList);
      this.drawService.setLayerList(this.layerList);
    }
    this.drawLayers();
  }

  //--------------------------------------------------------------------------------------
  // METHODE setMousePosition : recupère la position de la souris et set les variables x et y
  //--------------------------------------------------------------------------------------
  public setMousePosition(e: MouseEvent): void {
    if (
      this.canvas &&
      this.canvas.parentElement &&
      this.canvas.parentElement.parentElement
    ) {
      this.x = e.clientX - this.canvas.parentElement?.parentElement.offsetLeft;
      this.y = e.clientY - this.canvas.parentElement?.parentElement.offsetTop;
    }
  }

  public actionHandler(coord: Coordonnees): void {
    const shapeParameters = new ShapeParameters(
      this.drawService.thickness,
      this.drawService.colorFillShape,
      this.drawService.colorStrokeShape,
      [coord]
    );
    const _shape = this.getShapeIntersected(coord);
    switch (this.drawService.activeTool) {
      case Tools.Selection:
        break;
      case Tools.Move:
        if (_shape !== null) {
          this.currentAction = new Move(
            _shape,
            new Coordonnees(this.x, this.y)
          );
        }
        break;
      case Tools.Scale:
        if (_shape !== null) {
          this.currentAction = new Scale(
            _shape,
            new Coordonnees(this.x, this.y)
          );
        }
        break;
      case Tools.Rotate:
        if (_shape !== null) {
          this.currentAction = new Rotate(
            _shape,
            new Coordonnees(this.x, this.y)
          );
        }
        break;
      case Tools.Fill:
        if (_shape !== null) {
          this.currentAction = new Fill(
            _shape,
            this.drawService.colorFillShape
          );
        } else {
          this.layerList.backgroundColor = this.drawService.colorFillShape;
          this.drawService.setLayerList(this.layerList);
        }
        break;
      case Tools.Pen:
        this.currentAction = new Draw(new Pen(shapeParameters));
        break;
      case Tools.Line:
        this.currentAction = new Draw(new Line(shapeParameters));
        break;
      case Tools.Box:
        this.currentAction = new Draw(new Rect(shapeParameters));
        break;
      case Tools.Circle:
        this.currentAction = new Draw(new Circle(shapeParameters));
        break;
      case Tools.Polygon:
        this.currentAction = new Draw(new Polygon(shapeParameters));
        break;
      case Tools.Eraser:
        this.currentAction = new Draw(new Eraser(shapeParameters));
        break;
      case Tools.Delete:
        if (_shape !== null) {
          this.currentAction = new Delete(_shape);
        }
    }

    if (this.currentAction !== null) {
      this.currentAction.previsu(coord);
    }
  }

  private getShapeIntersected(coord: Coordonnees): Shape | null {
    let _shape = null;
    //On reverse le tableau pour le parcourir dans l'ordre inverse afin d'avoir les elemtents plus haut en premier
    this.layerList.selectedLayer.shapeList.reverse().forEach((shape) => {
      if (shape.intersect(coord)) {
        _shape = shape;
        return;
      }
    });

    return _shape;
  }

  public clearCanvas(canvas: HTMLCanvasElement, isPreviCavas: boolean) {
    if (canvas !== null) {
      const parent = canvas.parentElement as HTMLElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        if (!isPreviCavas) {
          ctx.fillStyle = this.layerList.backgroundColor;
          ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        }
      }
    }
  }

  //--------------------------------------------------------------------------------------
  // METHODE drawAllShapes : permet de dessiner sur le canvas toutes les formes de la
  //						   liste de formes
  //--------------------------------------------------------------------------------------
  public drawLayers() {
    this.clearCanvas(this.canvasRef.nativeElement as HTMLCanvasElement, false);
    this.clearCanvas(
      this.canvasPreviRef.nativeElement as HTMLCanvasElement,
      true
    );
    //On trie la liste par id afin d'etre sur d'avoir l'ordre chronologique
    this.layerList.layerList.sort((layer1, layer2) => {
      return layer1.uuid - layer2.uuid;
    });
    this.layerList.layerList.forEach((layer) => {
      if (layer.isVisible) {
        layer.shapeList.sort((shape1, shape2) => {
          return shape1.parameters.uuid - shape2.parameters.uuid;
        });
        layer.shapeList.forEach((shape) => shape.draw());
      }
    });
  }
}
