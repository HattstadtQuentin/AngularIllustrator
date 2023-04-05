import {
  Component,
  OnInit,
  ElementRef,
  ChangeDetectorRef,
  ViewChild,
  Input,
} from '@angular/core';
import { Tools } from '../tools.enum';
import Ruler from '@scena/ruler';
import Gesto from 'gesto';
import { Triangle } from '../shapes/Triangle';
import { Circle } from '../shapes/Circle';
import { Rect } from '../shapes/Rect';
import { Line } from '../shapes/Line';
import { Coordonnees, Shape } from '../shapes/Shape';

import { HttpClient } from '@angular/common/http';

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
  public title: string; //Titre de la page
  public x: number; //Position x de la souris
  public y: number; //Position y de la souris
  public cordList: { x: number; y: number }[]; //Liste des coordonnées de la forme en cours de dessin
  public canvas?: HTMLCanvasElement;
  public context!: CanvasRenderingContext2D;
  public colorCanvas: string; //Couleur de fond du canvas
  @Input() public colorFillShape: string; //Couleur de remplissage de la forme en cours de dessin
  @Input() public colorStrokeShape: string;
  public fill: boolean; //Boolean : la forme en cours de dessin à un remplissage
  public stroke: boolean; //Boolean : la forme en cours de dessin à des contours
  public shapeList: Shape[];
  public currentShape: Shape | null;
  public previsionMode: boolean; //Boolean : on est en mode prévision
  public ruler1: Ruler | null = null;
  public ruler2: Ruler | null = null;

  //--------------------------------------------------------------------------------------
  // CONSTRUCTEUR
  //--------------------------------------------------------------------------------------
  constructor(
    private changeRef: ChangeDetectorRef,
    private elementRef: ElementRef,
    private http: HttpClient,
  ) {
    this.title = 'Espace de dessin';
    this.x = 0;
    this.y = 0;
    this.cordList = [];
    this.canvasRef = new ElementRef(null);
    this.canvasPreviRef = new ElementRef(null);
    this.colorCanvas = '#fff';
    this.colorFillShape = '#FFA500';
    this.colorStrokeShape = '#000000';
    this.fill = true;
    this.stroke = true;
    this.shapeList = [];
    this.currentShape = null;
    this.previsionMode = false;
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

    this.elementRef.nativeElement
      .querySelector('#drawingContainer')
      .addEventListener('mousedown', this.prevision.bind(this));

    this.elementRef.nativeElement
      .querySelector('#drawingContainer')
      .addEventListener('mouseup', this.cancelPrevision.bind(this));

    this.elementRef.nativeElement
      .querySelector('#drawingContainer')
      .addEventListener('mousemove', this.drawPrevision.bind(this));
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
  // METHODE prevision : lié à l'event mouseDown
  //--------------------------------------------------------------------------------------
  public prevision(e: MouseEvent): void {
    this.setMousePosition(e);
    console.log(this.shapeList);
    this.previsionMode = true;
  }

  //--------------------------------------------------------------------------------------
  // METHODE drawPrevision : lié à l'event mouseMove, va dessiner la prévision de la forme
  //					   choisie en attendant que le bouton de souris soit relaché
  //--------------------------------------------------------------------------------------
  public drawPrevision(e: MouseEvent): void {
    if (this.previsionMode) {
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
          e.clientX - this.canvas.parentElement ?.parentElement.offsetLeft - 50;
        this.y =
          e.clientY - this.canvas.parentElement ?.parentElement.offsetTop - 50;
      }

      this.draw(this.x, this.y, true);
    }
  }

  //--------------------------------------------------------------------------------------
  // METHODE cancelPrevision : lié à l'event mouseUp, va stopper les prévisions de la forme
  //					   		  choisie et va dessiner la forme
  //--------------------------------------------------------------------------------------
  public cancelPrevision(e: MouseEvent): void {
    this.previsionMode = false;
    this.setMousePosition(e);
    if (this.currentShape !== null) {
      this.shapeList.push(this.currentShape);
    }
    this.currentShape = null;
    this.drawAllShapes(this.shapeList);

    if (this.activeTool == Tools.Select)
      this.ChangeCanvasColor(this.colorCanvas);
  }

  //--------------------------------------------------------------------------------------
  // METHODE setMousePosition : recupère la position de la souris et lance le processus
  //						   	  de dessin
  //--------------------------------------------------------------------------------------
  public setMousePosition(e: MouseEvent): void {
    if (
      this.canvas &&
      this.canvas.parentElement &&
      this.canvas.parentElement.parentElement
    ) {
      this.x =
        e.clientX - this.canvas.parentElement ?.parentElement.offsetLeft - 50;
      this.y =
        e.clientY - this.canvas.parentElement ?.parentElement.offsetTop - 50;
    }

    this.draw(this.x, this.y, false);
  }

  //--------------------------------------------------------------------------------------
  // METHODE draw : va dessiner la forme choisie
  //--------------------------------------------------------------------------------------
  public draw(x: number, y: number, prevision: boolean): void {
    if (this.currentShape === null) {
      console.log(this.activeTool);
      switch (this.activeTool) {
        case Tools.Select:
          this.ChangeCanvasColor('green');
          break;
        case Tools.Selection:
          break;
        case Tools.Draw:
          break;
        case Tools.Line:
          this.currentShape = new Line(
            this.fill,
            this.stroke,
            this.colorFillShape,
            this.colorStrokeShape,
            [new Coordonnees(x, y)]
          );
          break;
        case Tools.Box:
          this.currentShape = new Rect(
            this.fill,
            this.stroke,
            this.colorFillShape,
            this.colorStrokeShape,
            [new Coordonnees(x, y)]
          );
          break;
        case Tools.Circle:
          this.currentShape = new Circle(
            this.fill,
            this.stroke,
            this.colorFillShape,
            this.colorStrokeShape,
            [new Coordonnees(x, y)]
          );
          break;
        case Tools.Triangle:
          this.currentShape = new Triangle(
            this.fill,
            this.stroke,
            this.colorFillShape,
            this.colorStrokeShape,
            [new Coordonnees(x, y)]
          );
          break;
        case Tools.Eraser:
          break;
      }
      if (this.currentShape !== null) {
        this.currentShape.draw(x, y, 0, prevision);
      }
    } else {
      this.currentShape.draw(x, y, 0, prevision);
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

    this.drawAllShapes(this.shapeList);
  }

  //--------------------------------------------------------------------------------------
  // METHODE drawAllShapes : permet de dessiner sur le canvas toutes les formes de la
  //						   liste de formes
  //--------------------------------------------------------------------------------------
  public drawAllShapes(shapes: Shape[]) {
    let size = shapes.length;
    for (let i = 0; i < size; i++) {
      new Shape(
        shapes[i].stroke,
        shapes[i].fill,
        shapes[i].colorFillShape,
        shapes[i].colorStrokeShape,
        shapes[i].coordList
      ).draw(-1, -1, 1, false);
    }
  }


  //-------------------------------------------------------------------------------------
  public importJson(event: any): void {

    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const fileContent: string = e.target.result;
      console.log(fileContent);
    };

    reader.readAsText(file);

  }
  //-------------------------------------------------------------------------------------



  //-------------------------------------------------------------------------------------
  public exportJson() {

    const jsonData = JSON.stringify(this.shapeList);

    console.log(jsonData);
    let blob = new Blob(['\ufeff' + jsonData], { type: 'application/json;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display:none');
    a.href = url;
    a.download = 'data.json';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove(); // remove the element from the DOM

  }
  //-------------------------------------------------------------------------------------

}



