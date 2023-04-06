import {
  Component,
  OnInit,
  ElementRef,
  ChangeDetectorRef,
  ViewChild,
  Input,
} from '@angular/core';
import { Tools } from '../tools.enum';
import { Triangle } from '../shapes/Triangle';
import { Circle } from '../shapes/Circle';
import { Rect } from '../shapes/Rect';
import { Line } from '../shapes/Line';
import { Coordonnees, Shape } from '../shapes/Shape';
import { ActionsList } from '../actions/ActionsList';
import { Draw } from '../actions/Draw';
import { Action } from '../actions/Action';

@Component({
  selector: 'app-drawing-zone',
  templateUrl: './drawing-zone.component.html',
  styleUrls: ['./drawing-zone.component.scss'],
})
export class DrawingZoneComponent implements OnInit {
  @ViewChild('canvas') canvasRef: ElementRef;
  @ViewChild('canvasPrevi') canvasPreviRef: ElementRef;
  @Input() activeTool = Tools.Line;
  @Input() backgroundColor = '#1A1F39';

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
  public fill: boolean; //Boolean : la forme en cours de dessin à un remplissage
  public stroke: boolean; //Boolean : la forme en cours de dessin à des contours

  public shapeList: Shape[];
  public actionList: ActionsList;
  public currentAction: Action | null;

  public isDrawing: boolean; //Boolean : dessin en cours
  public controlKeyPressed: boolean; //Boolean : la touche control est appuyé ou non, utilisé lors du undo redo
  public majKeyPressed: boolean; //Boolean : la touche maj est appuyé ou non, utilisé lors du redo

  //--------------------------------------------------------------------------------------
  // CONSTRUCTEUR
  //--------------------------------------------------------------------------------------
  constructor(private elementRef: ElementRef) {
    this.canvasRef = new ElementRef(null);
    this.canvasPreviRef = new ElementRef(null);

    this.x = 0;
    this.y = 0;
    this.colorCanvas = '#fff';

    this.cordList = [];
    this.colorFillShape = '#FFA500';
    this.colorStrokeShape = '#000000';
    this.fill = true;
    this.stroke = true;

    this.shapeList = [];
    this.actionList = new ActionsList();
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
      this.resizeCanvas();
      window.addEventListener('resize', this.resizeCanvas.bind(this));
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
        console.log(this.shapeList);
        this.shapeList = this.actionList.redo(this.shapeList);
        console.log(this.shapeList);
        this.drawAllShapes();
      } else if (this.controlKeyPressed) {
        console.log(this.shapeList);
        this.shapeList = this.actionList.undo(this.shapeList);
        console.log(this.shapeList);
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
  //
  //--------------------------------------------------------------------------------------
  resizeCanvas(): void {
    if (!this.canvasRef.nativeElement && !this.canvasPreviRef.nativeElement) {
      return;
    }

    const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    const parent = canvas.parentElement as HTMLElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;

    const previCanvas = this.canvasPreviRef.nativeElement as HTMLCanvasElement;
    previCanvas.width = parent.offsetWidth;
    previCanvas.height = parent.offsetHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = this.colorCanvas;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
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
          e.clientX - this.canvas.parentElement?.parentElement.offsetLeft - 50;
        this.y =
          e.clientY - this.canvas.parentElement?.parentElement.offsetTop - 50;
      }

      if (this.currentAction !== null) {
        this.currentAction.previsu(new Coordonnees(this.x, this.y));
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
      this.shapeList = this.currentAction.do(this.shapeList);
      this.actionList.undoList.push(this.currentAction);
      this.currentAction = null;
    }
    this.drawAllShapes();

    if (this.activeTool == Tools.Select)
      this.ChangeCanvasColor(this.colorCanvas);
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
      this.x =
        e.clientX - this.canvas.parentElement?.parentElement.offsetLeft - 50;
      this.y =
        e.clientY - this.canvas.parentElement?.parentElement.offsetTop - 50;
    }
  }

  public actionHandler(coord: Coordonnees): void {
    switch (this.activeTool) {
      case Tools.Select:
        this.ChangeCanvasColor('green');
        break;
      case Tools.Selection:
        break;
      case Tools.Draw:
        break;
      case Tools.Line:
        this.currentAction = new Draw(
          new Line(
            this.fill,
            this.stroke,
            this.colorFillShape,
            this.colorStrokeShape,
            [coord]
          )
        );
        break;
      case Tools.Box:
        this.currentAction = new Draw(
          new Rect(
            this.fill,
            this.stroke,
            this.colorFillShape,
            this.colorStrokeShape,
            [coord]
          )
        );
        break;
      case Tools.Circle:
        this.currentAction = new Draw(
          new Circle(
            this.fill,
            this.stroke,
            this.colorFillShape,
            this.colorStrokeShape,
            [coord]
          )
        );
        break;
      case Tools.Triangle:
        this.currentAction = new Draw(
          new Triangle(
            this.fill,
            this.stroke,
            this.colorFillShape,
            this.colorStrokeShape,
            [coord]
          )
        );
        break;
      case Tools.Eraser:
        break;
    }

    if (this.currentAction !== null) {
      this.currentAction.previsu(coord);
    }
  }

  //--------------------------------------------------------------------------------------
  // METHODE ChangeCanvasColor : permet de changer la couleur de fond du canvas
  //--------------------------------------------------------------------------------------
  public ChangeCanvasColor(color: string) {
    const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    const parent = canvas.parentElement as HTMLElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    this.colorCanvas = color;
  }

  public clearCanvas(canvas: HTMLCanvasElement) {
    const parent = canvas.parentElement as HTMLElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  //--------------------------------------------------------------------------------------
  // METHODE drawAllShapes : permet de dessiner sur le canvas toutes les formes de la
  //						   liste de formes
  //--------------------------------------------------------------------------------------
  public drawAllShapes() {
    this.clearCanvas(this.canvasRef.nativeElement as HTMLCanvasElement);
    this.clearCanvas(this.canvasPreviRef.nativeElement as HTMLCanvasElement);
    this.shapeList.forEach((shape) => {
      shape.draw();
    });
  }
}
