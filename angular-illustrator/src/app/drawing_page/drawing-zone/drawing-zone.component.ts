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
  public shapeList: {
    //Liste des formes du canvas de la session courrante

    type: number; //Type de forme (1=trait, 2=rect, etc.)
    fill: boolean; //La forme à un remplissage : true/false
    stroke: boolean; //La forme à des contours : true/false
    colorFillShape: string; //Couleur de remplissage s'il y en a une
    colorStrokeShape: string;
    x1: number; //Coordonnée x du premier point de la forme
    y1: number; //Coordonnée y du premier point de la forme
    x2: number; //Coordonnée x du deuxieme point de la forme
    y2: number; //Coordonnée y du deuxieme point de la forme
    x3: number; //Coordonnée x du troisieme point de la forme s'il y en a un
    y3: number; //Coordonnée y du troisieme point de la forme s'il y en a un
    x4: number; //Coordonnée x du quatrieme point de la forme s'il y en a un
    y4: number; //Coordonnée y du quatrieme point de la forme s'il y en a un
  }[];
  public previsionMode: boolean; //Boolean : on est en mode prévision
  public ruler1: Ruler | null = null;
  public ruler2: Ruler | null = null;

  //--------------------------------------------------------------------------------------
  // CONSTRUCTEUR
  //--------------------------------------------------------------------------------------
  constructor(
    private changeRef: ChangeDetectorRef,
    private elementRef: ElementRef
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
    this.previsionMode = false;
  }

  //--------------------------------------------------------------------------------------
  //
  //--------------------------------------------------------------------------------------
  ngOnInit() {
    setTimeout(() => {
      this.resizeCanvas();
      window.addEventListener('resize', this.resizeCanvas.bind(this));
      const ruler1Element: HTMLElement | null =
        document.querySelector('.ruler.horizontal');
      if (ruler1Element) {
        this.ruler1 = new Ruler(ruler1Element, {
          type: 'horizontal',
          backgroundColor: '#252C48',
        });
      }
      const ruler2Element: HTMLElement | null =
        document.querySelector('.ruler.vertical');
      if (ruler2Element) {
        this.ruler2 = new Ruler(ruler2Element, {
          type: 'vertical',
          backgroundColor: '#252C48',
        });
      }

      window.addEventListener('resize', () => {
        if (this.ruler1 !== null && this.ruler2) {
          this.ruler1.resize();
          this.ruler2.resize();
        }
      });
      let scrollX = 0;
      let scrollY = 0;

      new Gesto(document.body).on('drag', (e) => {
        scrollX -= e.deltaX;
        scrollY -= e.deltaY;
        if (this.ruler1 !== null && this.ruler2) {
          this.ruler1.scroll(scrollX);
          this.ruler2.scroll(scrollY);
        }
      });
    });
  }

  //--------------------------------------------------------------------------------------
  //
  //--------------------------------------------------------------------------------------
  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;

    //this.elementRef.nativeElement.querySelector('#drawingContainer')
    //.addEventListener('click', this.setMousePosition.bind(this));

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
          e.clientX - this.canvas.parentElement?.parentElement.offsetLeft - 50;
        this.y =
          e.clientY - this.canvas.parentElement?.parentElement.offsetTop - 50;
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

    if (this.activeTool != Tools.Select)
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
        e.clientX - this.canvas.parentElement?.parentElement.offsetLeft - 50;
      this.y =
        e.clientY - this.canvas.parentElement?.parentElement.offsetTop - 50;
    }

    this.draw(this.x, this.y, false);
  }

  //--------------------------------------------------------------------------------------
  // METHODE draw : va dessiner la forme choisie
  //--------------------------------------------------------------------------------------
  public draw(x: number, y: number, prevision: boolean): void {
    switch (this.activeTool) {
      case Tools.Select:
        this.ChangeCanvasColor('green');
        break;
      case Tools.Selection:
        break;
      case Tools.Draw:
        break;
      case Tools.Line:
        this.lineDrawing(
          x,
          y,
          0,
          prevision,
          this.colorFillShape,
          this.colorStrokeShape
        );
        break;
      case Tools.Box:
        this.RectDrawing(
          x,
          y,
          0,
          prevision,
          this.colorFillShape,
          this.colorStrokeShape
        );
        break;
      case Tools.Circle:
        this.CircleDrawing(
          x,
          y,
          0,
          prevision,
          this.colorFillShape,
          this.colorStrokeShape
        );
        break;
      case Tools.Triangle:
        this.TriangleDrawing(
          x,
          y,
          0,
          prevision,
          this.colorFillShape,
          this.colorStrokeShape
        );
        break;
      case Tools.Eraser:
        break;
    }
  }

  //--------------------------------------------------------------------------------------
  // METHODE lineDrawing : permet de dessiner une ligne sur le canvas avec deux clicks
  //						 de souris simulant le debut et la fin de la ligne.
  //--------------------------------------------------------------------------------------
  public lineDrawing(
    x: number,
    y: number,
    type: number,
    prevision: boolean,
    colorFillShape: string,
    colorStrokeShape: string
  ): void {
    if (!this.canvas) {
      return;
    } else {
      let canvas: HTMLCanvasElement = document.getElementById(
        'drawingContainer'
      )! as HTMLCanvasElement;
      if (prevision) {
        canvas = document.getElementById(
          'previsualisationContainer'
        )! as HTMLCanvasElement;
      }
      const ctx = canvas.getContext('2d');

      if (type == 0) {
        this.cordList.push({ x: x, y: y });
      }

      if (this.cordList.length == 2 || type == 1) {
        if (ctx) {
          ctx.strokeStyle = colorFillShape;
          ctx.moveTo(this.cordList[0].x, this.cordList[0].y);
          ctx.lineTo(this.cordList[1].x, this.cordList[1].y);
          ctx.stroke();

          if (!prevision && type == 0) {
            this.shapeList.push({
              type: 1,
              fill: this.fill,
              stroke: this.stroke,
              colorFillShape: colorFillShape,
              colorStrokeShape: colorStrokeShape,
              x1: this.cordList[0].x,
              y1: this.cordList[0].y,
              x2: this.cordList[1].x,
              y2: this.cordList[1].y,
              x3: -1,
              y3: -1,
              x4: -1,
              y4: -1,
            });
          }

          if (!prevision) {
            let size = this.cordList.length;
            for (let i = 0; i < size; i++) {
              this.cordList.pop();
            }
          } else {
            this.cordList.pop();
          }
        }
      }
    }
  }

  //--------------------------------------------------------------------------------------
  // METHODE RectDrawing : permet de dessiner un rectangle sur le canvas avec deux clicks
  //						 de souris simulant le debut et la fin de la diagonale du rect.
  //--------------------------------------------------------------------------------------
  public RectDrawing(
    x: number,
    y: number,
    type: number,
    prevision: boolean,
    colorFillShape: string,
    colorStrokeShape: string
  ): void {
    if (!this.canvas) {
      return;
    } else {
      let canvas: HTMLCanvasElement = document.getElementById(
        'drawingContainer'
      )! as HTMLCanvasElement;
      if (prevision) {
        canvas = document.getElementById(
          'previsualisationContainer'
        )! as HTMLCanvasElement;
      }
      const ctx = canvas.getContext('2d');

      if (type == 0) this.cordList.push({ x: x, y: y });

      if (this.cordList.length == 2 || type == 1) {
        let largeur = 0;
        let hauteur = 0;
        if (ctx) {
          largeur = this.cordList[1].x - this.cordList[0].x;
          hauteur = this.cordList[1].y - this.cordList[0].y;

          if (this.fill && this.stroke) {
            ctx.fillStyle = colorFillShape;
            ctx.strokeStyle = colorStrokeShape;
            ctx.fillRect(
              this.cordList[0].x,
              this.cordList[0].y,
              largeur,
              hauteur
            );
            ctx.strokeRect(
              this.cordList[0].x,
              this.cordList[0].y,
              largeur,
              hauteur
            );
          } else if (this.fill) {
            ctx.fillStyle = this.colorFillShape;
            ctx.fillRect(
              this.cordList[0].x,
              this.cordList[0].y,
              largeur,
              hauteur
            );
          } else if (this.stroke) {
            ctx.strokeStyle = this.colorStrokeShape;
            ctx.strokeRect(
              this.cordList[0].x,
              this.cordList[0].y,
              largeur,
              hauteur
            );
          }

          if (!prevision && type == 0) {
            this.shapeList.push({
              type: 2,
              fill: this.fill,
              stroke: this.stroke,
              colorFillShape: this.colorFillShape,
              colorStrokeShape: this.colorStrokeShape,
              x1: this.cordList[0].x,
              y1: this.cordList[0].y,
              x2: this.cordList[1].x,
              y2: this.cordList[1].y,
              x3: -1,
              y3: -1,
              x4: -1,
              y4: -1,
            });
          }

          if (!prevision) {
            let size = this.cordList.length;
            for (let i = 0; i < size; i++) {
              this.cordList.pop();
            }
          } else {
            this.cordList.pop();
          }
        }
      }
    }
  }

  //--------------------------------------------------------------------------------------
  // METHODE CircleDrawing : permet de dessiner un cercle sur le canvas avec deux clicks
  //						 de souris simulant le debut et la fin du rayon du cercle.
  //--------------------------------------------------------------------------------------
  public CircleDrawing(
    x: number,
    y: number,
    type: number,
    prevision: boolean,
    colorFillShape: string,
    colorStrokeShape: string
  ): void {
    if (!this.canvas) {
      return;
    } else {
      let canvas: HTMLCanvasElement = document.getElementById(
        'drawingContainer'
      )! as HTMLCanvasElement;
      if (prevision) {
        canvas = document.getElementById(
          'previsualisationContainer'
        )! as HTMLCanvasElement;
      }
      const ctx = canvas.getContext('2d');

      if (type == 0) this.cordList.push({ x: x, y: y });

      if (this.cordList.length == 2 || type == 1) {
        let largeur = 0;
        let hauteur = 0;
        let rayon = 0;
        if (ctx) {
          largeur = Math.abs(this.cordList[1].x - this.cordList[0].x);
          hauteur = Math.abs(this.cordList[1].y - this.cordList[0].y);
          rayon = Math.sqrt(largeur * largeur + hauteur * hauteur);

          ctx.beginPath();

          if (this.fill && this.stroke) {
            ctx.fillStyle = colorFillShape;
            ctx.strokeStyle = colorStrokeShape;
            ctx.arc(
              this.cordList[0].x,
              this.cordList[0].y,
              rayon,
              0,
              Math.PI * 2,
              true
            );
            ctx.fill();
            ctx.stroke();
          } else if (this.fill) {
            ctx.fillStyle = this.colorFillShape;
            ctx.arc(
              this.cordList[0].x,
              this.cordList[0].y,
              rayon,
              0,
              Math.PI * 2,
              true
            );
            ctx.fill();
          } else if (this.stroke) {
            ctx.strokeStyle = this.colorStrokeShape;
            ctx.arc(
              this.cordList[0].x,
              this.cordList[0].y,
              rayon,
              0,
              Math.PI * 2,
              true
            );
            ctx.stroke();
          }

          if (!prevision && type == 0) {
            this.shapeList.push({
              type: 3,
              fill: this.fill,
              stroke: this.stroke,
              colorFillShape: this.colorFillShape,
              colorStrokeShape: this.colorStrokeShape,
              x1: this.cordList[0].x,
              y1: this.cordList[0].y,
              x2: this.cordList[1].x,
              y2: this.cordList[1].y,
              x3: -1,
              y3: -1,
              x4: -1,
              y4: -1,
            });
          }

          if (!prevision) {
            let size = this.cordList.length;
            for (let i = 0; i < size; i++) {
              this.cordList.pop();
            }
          } else {
            this.cordList.pop();
          }
        }
      }
    }
  }

  //--------------------------------------------------------------------------------------
  // METHODE TriangleDrawing : permet de dessiner un triangle sur le canvas avec trois clicks
  //						 de souris simulant les 3 sommets du triangle.
  //--------------------------------------------------------------------------------------
  public TriangleDrawing(
    x: number,
    y: number,
    type: number,
    prevision: boolean,
    colorFillShape: string,
    colorStrokeShape: string
  ): void {
    if (!this.canvas) {
      return;
    } else {
      let canvas: HTMLCanvasElement = document.getElementById(
        'drawingContainer'
      )! as HTMLCanvasElement;
      if (prevision) {
        canvas = document.getElementById(
          'previsualisationContainer'
        )! as HTMLCanvasElement;
      }
      const ctx = canvas.getContext('2d');

      if (type == 0) this.cordList.push({ x: x, y: y });

      if (this.cordList.length == 3 || type == 1) {
        if (ctx) {
          ctx.beginPath();

          if (this.fill && this.stroke) {
            ctx.fillStyle = colorFillShape;
            ctx.strokeStyle = colorStrokeShape;
            ctx.moveTo(this.cordList[0].x, this.cordList[0].y);
            ctx.lineTo(this.cordList[1].x, this.cordList[1].y);
            ctx.lineTo(this.cordList[2].x, this.cordList[2].y);
            ctx.lineTo(this.cordList[0].x, this.cordList[0].y);
            ctx.fill();
            ctx.stroke();
          } else if (this.fill) {
            ctx.fillStyle = this.colorFillShape;
            ctx.moveTo(this.cordList[0].x, this.cordList[0].y);
            ctx.lineTo(this.cordList[1].x, this.cordList[1].y);
            ctx.lineTo(this.cordList[2].x, this.cordList[2].y);
            ctx.fill();
          } else if (this.stroke) {
            ctx.strokeStyle = this.colorStrokeShape;
            ctx.moveTo(this.cordList[0].x, this.cordList[0].y);
            ctx.lineTo(this.cordList[1].x, this.cordList[1].y);
            ctx.lineTo(this.cordList[2].x, this.cordList[2].y);
            ctx.lineTo(this.cordList[0].x, this.cordList[0].y);
            ctx.stroke();
          }

          if (!prevision && type == 0) {
            this.shapeList.push({
              type: 4,
              fill: this.fill,
              stroke: this.stroke,
              colorFillShape: this.colorFillShape,
              colorStrokeShape: this.colorStrokeShape,
              x1: this.cordList[0].x,
              y1: this.cordList[0].y,
              x2: this.cordList[1].x,
              y2: this.cordList[1].y,
              x3: this.cordList[2].x,
              y3: this.cordList[2].y,
              x4: -1,
              y4: -1,
            });
          }

          if (!prevision) {
            let size = this.cordList.length;
            for (let i = 0; i < size; i++) {
              this.cordList.pop();
            }
          } else {
            this.cordList.pop();
          }
        }
      }
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
  public drawAllShapes(
    list: {
      type: number;
      fill: boolean;
      stroke: boolean;
      colorFillShape: string;
      colorStrokeShape: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      x3: number;
      y3: number;
      x4: number;
      y4: number;
    }[]
  ) {
    let size = list.length;
    for (let i = 0; i < size; i++) {
      switch (list[i].type) {
        case 1:
          this.cordList.push({ x: list[i].x1, y: list[i].y1 });
          this.cordList.push({ x: list[i].x2, y: list[i].y2 });
          this.lineDrawing(
            -1,
            -1,
            1,
            false,
            list[i].colorFillShape,
            list[i].colorStrokeShape
          );
          break;
        case 2:
          this.cordList.push({ x: list[i].x1, y: list[i].y1 });
          this.cordList.push({ x: list[i].x2, y: list[i].y2 });
          this.RectDrawing(
            -1,
            -1,
            1,
            false,
            list[i].colorFillShape,
            list[i].colorStrokeShape
          );
          break;
        case 3:
          this.cordList.push({ x: list[i].x1, y: list[i].y1 });
          this.cordList.push({ x: list[i].x2, y: list[i].y2 });
          this.CircleDrawing(
            -1,
            -1,
            1,
            false,
            list[i].colorFillShape,
            list[i].colorStrokeShape
          );
          break;
        case 4:
          this.cordList.push({ x: list[i].x1, y: list[i].y1 });
          this.cordList.push({ x: list[i].x2, y: list[i].y2 });
          this.cordList.push({ x: list[i].x3, y: list[i].y3 });
          this.TriangleDrawing(
            -1,
            -1,
            1,
            false,
            list[i].colorFillShape,
            list[i].colorStrokeShape
          );
          break;
      }
    }
  }
}
