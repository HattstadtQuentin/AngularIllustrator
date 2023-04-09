import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  EventEmitter,
  Output,
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

@Component({
  selector: 'app-drawing-zone',
  templateUrl: './drawing-zone.component.html',
  styleUrls: ['./drawing-zone.component.scss'],
})
export class DrawingZoneComponent implements OnInit {
  @ViewChild('canvas') canvasRef: ElementRef;
  @ViewChild('canvasPrevi') canvasPreviRef: ElementRef;
  @Input() activeTool = Tools.Line;

  //--------------------------------------------------------------------------------------
  // DECLARATION DES ATTRIBUTS
  //--------------------------------------------------------------------------------------
  //Attributs globaux
  public x: number; //Position x de la souris
  public y: number; //Position y de la souris
  public canvas?: HTMLCanvasElement;
  public colorCanvas: string; //Couleur de fond du canvas

  //Attributs de la shape en cours
  public cordList: { x: number; y: number }[]; //Liste des coordonnées de la forme en cours de dessin
  @Input() public colorFillShape: string; //Couleur de remplissage de la forme en cours de dessin
  @Input() public colorStrokeShape: string;
  @Input() public thickness: number; //Number : epaisseur du trait

  private _shapeList: Shape[];

  @Input()
  set shapeList(value: Shape[]) {
    this._shapeList = value;
    this.drawAllShapes();
  }
  @Output() shapeListChange: EventEmitter<Shape[]> = new EventEmitter<
    Shape[]
  >();
  public actionList: ActionsList;
  public currentAction: Action | null;

  public backgroundColor: string;

  public isDrawing: boolean; //Boolean : dessin en cours
  public controlKeyPressed: boolean; //Boolean : la touche control est appuyé ou non, utilisé lors du undo redo
  public majKeyPressed: boolean; //Boolean : la touche maj est appuyé ou non, utilisé lors du redo

  //--------------------------------------------------------------------------------------
  // CONSTRUCTEUR
  //--------------------------------------------------------------------------------------
  constructor(private elementRef: ElementRef) {
    this.x = 0;
    this.y = 0;
    this.cordList = [];
    this.canvasRef = new ElementRef(null);
    this.canvasPreviRef = new ElementRef(null);

    this.x = 0;
    this.y = 0;
    this.colorCanvas = '#fff';

    this.cordList = [];
    this.colorFillShape = '#FFA500';
    this.colorStrokeShape = '#000000';
    this.thickness = 1;

    this._shapeList = [];
    this.actionList = new ActionsList();
    this.currentAction = null;

    this.backgroundColor = '#fff';

    this.isDrawing = false;
    this.controlKeyPressed = false;
    this.majKeyPressed = false;
  }

  //--------------------------------------------------------------------------------------
  //
  //--------------------------------------------------------------------------------------
  ngOnInit() {
    setTimeout(() => {
      this.drawAllShapes();
      window.addEventListener('resize', this.drawAllShapes.bind(this));
    });
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
        this._shapeList = this.actionList.redo(this._shapeList);
        this.drawAllShapes();
      } else if (this.controlKeyPressed) {
        this._shapeList = this.actionList.undo(this._shapeList);
        this.drawAllShapes();
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
          this.currentAction instanceof Scale
        ) {
          this.drawAllShapes();
        }
        //Il est nécéssaire de redessiner toutes les formes lors de l'action gomme pour voir les modifications en temps réel.
        if (
          this.currentAction instanceof Draw &&
          this.currentAction.shape instanceof Eraser
        ) {
          if (!this._shapeList.includes(this.currentAction.shape)) {
            this._shapeList.push(this.currentAction.shape);
          }
          this.drawAllShapes();
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
      this._shapeList = this.currentAction.do(this._shapeList);
      this.actionList.undoList.push(this.currentAction);
      this.currentAction = null;
    }
    this.drawAllShapes();
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
      this.thickness,
      this.colorFillShape,
      this.colorStrokeShape,
      [coord]
    );
    let _shape = null;
    switch (this.activeTool) {
      case Tools.Selection:
        break;
      case Tools.Move:
        _shape = this.getShapeIntersected(coord);
        if (_shape !== null) {
          this.currentAction = new Move(
            _shape,
            new Coordonnees(this.x, this.y)
          );
        }
        break;
      case Tools.Scale:
        _shape = this.getShapeIntersected(coord);
        if (_shape !== null) {
          this.currentAction = new Scale(
            _shape,
            new Coordonnees(this.x, this.y)
          );
        }
        break;
      case Tools.Fill:
        _shape = this.getShapeIntersected(coord);
        if (_shape !== null) {
          this.currentAction = new Fill(_shape, this.colorFillShape);
        } else {
          this.backgroundColor = this.colorFillShape;
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
        _shape = this.getShapeIntersected(coord);
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
    this._shapeList.reverse().forEach((shape) => {
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
          ctx.fillStyle = this.backgroundColor;
          ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        }
      }
    }
  }

  //--------------------------------------------------------------------------------------
  // METHODE drawAllShapes : permet de dessiner sur le canvas toutes les formes de la
  //						   liste de formes
  //--------------------------------------------------------------------------------------
  public drawAllShapes() {
    this.clearCanvas(this.canvasRef.nativeElement as HTMLCanvasElement, false);
    this.clearCanvas(
      this.canvasPreviRef.nativeElement as HTMLCanvasElement,
      true
    );
    //On trie la liste par id afin d'etre sur d'avoir l'ordre chronologique
    this._shapeList.sort((shape1, shape2) => {
      return shape1.parameters.uuid - shape2.parameters.uuid;
    });
    this._shapeList.forEach((shape) => {
      shape.draw();
    });
  }
}
