import { Component, OnInit, ElementRef, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { Tools } from '../tools.enum';
import Ruler from "@scena/ruler";
import Gesto from "gesto";


@Component({
	selector: 'app-drawing-zone',
	templateUrl: './drawing-zone.component.html',
	styleUrls: ['./drawing-zone.component.scss']
})

export class DrawingZoneComponent implements OnInit {
	@ViewChild('canvas') canvasRef: ElementRef;
	@Input() activeTool = Tools.Line; 
	@Input() backgroundColor = '#1A1F39';

	//--------------------------------------------------------------------------------------
	// DECLARATION DES ATTRIBUTS
	//--------------------------------------------------------------------------------------
	public title: string; 								//Titre de la page
	public x: number;									//Position x de la souris
	public y: number;									//Position y de la souris
	public cordList: { x: number, y: number }[];		//Liste des coordonnées de la forme en cours de dessin
	public canvas?: HTMLCanvasElement;
	public context!: CanvasRenderingContext2D;
	public colorCanvas: string;							//Couleur de fond du canvas
	public colorFillShape: string;						//Couleur de remplissage de la forme en cours de dessin
	public colorStrokShape: string;						//Couleur des coutours de la forme en cours de desssin
	public fill: boolean;								//Boolean : la forme en cours de dessin à un remplissage
	public strok: boolean;								//Boolean : la forme en cours de dessin à des contours
	public shapeList: {									//Liste des formes du canvas de la session courrante

		type: number,				//Type de forme (1=trait, 2=rect, etc.)
		fill: boolean,				//La forme à un remplissage : true/false
		strok: boolean,				//La forme à des contours : true/false
		colorFillShape: string,		//Couleur de remplissage s'il y en a une
		colorStrokShape: string,	//Couleur des contours s'il y en a une
		x1: number,					//Coordonnée x du premier point de la forme
		y1: number,					//Coordonnée y du premier point de la forme
		x2: number,					//Coordonnée x du deuxieme point de la forme
		y2: number,					//Coordonnée y du deuxieme point de la forme
		x3: number,					//Coordonnée x du troisieme point de la forme s'il y en a un
		y3: number,					//Coordonnée y du troisieme point de la forme s'il y en a un
		x4: number,					//Coordonnée x du quatrieme point de la forme s'il y en a un
		y4: number					//Coordonnée y du quatrieme point de la forme s'il y en a un
	}[];
	public ruler1: Ruler | null = null;
	public ruler2: Ruler | null = null;

	//--------------------------------------------------------------------------------------
	// CONSTRUCTEUR 
	//--------------------------------------------------------------------------------------
	constructor(private changeRef: ChangeDetectorRef, private elementRef: ElementRef) {
		this.title = 'Espace de dessin';
		this.x = 0;
		this.y = 0;
		this.cordList = [];
		this.canvasRef = new ElementRef(null);
		this.colorCanvas = "#c1bcbc";
		this.colorFillShape = "#FFA500";
		this.colorStrokShape = "#c91414";
		this.fill = true;
		this.strok = true
		this.shapeList = [];
	}


	//--------------------------------------------------------------------------------------
	//
	//--------------------------------------------------------------------------------------
	ngOnInit() {
		setTimeout(() => {
			this.resizeCanvas();
			window.addEventListener('resize', this.resizeCanvas.bind(this));
			const ruler1Element: HTMLElement | null = document.querySelector(".ruler.horizontal");
			if (ruler1Element) {
				this.ruler1 = new Ruler(ruler1Element, {
					type: "horizontal",
					backgroundColor: "#252C48",
				});
			}
			const ruler2Element: HTMLElement | null = document.querySelector(".ruler.vertical");
			if (ruler2Element) {
				this.ruler2 = new Ruler(ruler2Element, {
					type: "vertical",
					backgroundColor: "#252C48",
				});
			}
		
			window.addEventListener("resize", () => {
				if(this.ruler1 !== null && this.ruler2){
					this.ruler1.resize();
					this.ruler2.resize();
				}
			});
			let scrollX = 0;
			let scrollY = 0;
		
			new Gesto(document.body).on("drag", e => {
				scrollX -= e.deltaX;
				scrollY -= e.deltaY;
				if(this.ruler1 !== null && this.ruler2){
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

		this.elementRef.nativeElement.querySelector('#drawingContainer')
			.addEventListener('click', this.setMousePosition.bind(this));

		this.elementRef.nativeElement.querySelector('#drawingContainer')
			.addEventListener('mousedown', this.prevision.bind(this));

		//this.elementRef.nativeElement.querySelector('#drawingContainer')
		//	.addEventListener('mouseup', this.draw.bind(this));
	}


	//--------------------------------------------------------------------------------------
	//
	//--------------------------------------------------------------------------------------
	resizeCanvas(): void {
		if (!this.canvasRef.nativeElement) {
			console.log('no ref');
			return;
		}


		const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
		const parent = canvas.parentElement as HTMLElement;
		canvas.width = parent.offsetWidth;
		canvas.height = parent.offsetHeight;

		const ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.fillStyle = this.colorCanvas;
			ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
		}
	}


	//--------------------------------------------------------------------------------------
	// METHODE prevision : lié à l'event mouseDown, va afficher les prévisions de la forme
	//					   choisie en attendant que le bouton de souris soit relaché
	//--------------------------------------------------------------------------------------
	public prevision(e: MouseEvent): void {

		//TODO : arriver à detecter le mouseUp Event pour quitter le while

		/*
		while (press == 1) {
		  console.log("mousedown");
		}
		*/
	}


	//--------------------------------------------------------------------------------------
	// METHODE setMousePosition : recupère la position de la souris et lance le processus
	//						   	  de dessin
	//--------------------------------------------------------------------------------------
	public setMousePosition(e: MouseEvent): void {

		if (this.canvas && this.canvas.parentElement && this.canvas.parentElement.parentElement) {
			this.x = e.clientX - this.canvas.parentElement?.parentElement.offsetLeft - 50;
			this.y = e.clientY - this.canvas.parentElement?.parentElement.offsetTop - 50;
		}

		this.draw(this.x, this.y);
	}


	//--------------------------------------------------------------------------------------
	// METHODE draw : lié à l'event mouseUP, va dessiner la forme choisie
	//--------------------------------------------------------------------------------------
	public draw(x: number, y: number): void {
		switch (this.activeTool) {
			case Tools.Select:
				this.ChangeCanvasColor("green");
				break;
			case Tools.Selection:
				break;
			case Tools.Draw:
				break;
			case Tools.Line:
				this.lineDrawing(x, y, 0);
				break;
			case Tools.Box:
				this.RectDrawing(x, y, 0);
				break;
			case Tools.Circle:
				this.CircleDrawing(x, y, 0);
				break;
			case Tools.Triangle:
				this.TriangleDrawing(x, y, 0);
				break;
			case Tools.Eraser:
				break;
		}
	}


	//--------------------------------------------------------------------------------------
	// METHODE lineDrawing : permet de dessiner une ligne sur le canvas avec deux clicks
	//						 de souris simulant le debut et la fin de la ligne.
	//--------------------------------------------------------------------------------------
	public lineDrawing(x: number, y: number, type: number): void {
		if (!this.canvas) {
			return;
		} else {
			let canvas: HTMLCanvasElement = document.getElementById('drawingContainer')! as HTMLCanvasElement;
			const ctx = canvas.getContext('2d');

			if (type == 0)
				this.cordList.push({ "x": x, "y": y });

			if (this.cordList.length == 2 || type == 1) {

				if (ctx) {
					ctx.strokeStyle = this.colorFillShape;
					ctx.moveTo(this.cordList[0].x, this.cordList[0].y);
					ctx.lineTo(this.cordList[1].x, this.cordList[1].y);
					ctx.stroke();

					this.shapeList.push(
						{
							type: 1,
							fill: this.fill,
							strok: this.strok,
							colorFillShape: this.colorFillShape,
							colorStrokShape: this.colorStrokShape,
							x1: this.cordList[0].x,
							y1: this.cordList[0].y,
							x2: this.cordList[1].x,
							y2: this.cordList[1].y,
							x3: -1,
							y3: -1,
							x4: -1,
							y4: -1
						}
					);

					let size = this.cordList.length;
					for (let i = 0; i < size; i++) {
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
	public RectDrawing(x: number, y: number, type: number): void {
		if (!this.canvas) {
			return;
		} else {
			let canvas: HTMLCanvasElement = document.getElementById('drawingContainer')! as HTMLCanvasElement;
			const ctx = canvas.getContext('2d');

			if (type == 0)
				this.cordList.push({ "x": x, "y": y });

			if (this.cordList.length == 2 || type == 1) {

				let largeur = 0;
				let hauteur = 0;
				if (ctx) {

					largeur = this.cordList[1].x - this.cordList[0].x;
					hauteur = this.cordList[1].y - this.cordList[0].y;

					if (this.fill && this.strok) {
						ctx.fillStyle = this.colorFillShape;
						ctx.strokeStyle = this.colorStrokShape;
						ctx.fillRect(this.cordList[0].x, this.cordList[0].y, largeur, hauteur);
						ctx.strokeRect(this.cordList[0].x, this.cordList[0].y, largeur, hauteur)

					} else if (this.fill) {
						ctx.fillStyle = this.colorFillShape;
						ctx.fillRect(this.cordList[0].x, this.cordList[0].y, largeur, hauteur);

					} else if (this.strok) {
						ctx.strokeStyle = this.colorStrokShape;
						ctx.strokeRect(this.cordList[0].x, this.cordList[0].y, largeur, hauteur);

					}

					if (type == 0) {
						this.shapeList.push(
							{
								type: 2,
								fill: this.fill,
								strok: this.strok,
								colorFillShape: this.colorFillShape,
								colorStrokShape: this.colorStrokShape,
								x1: this.cordList[0].x,
								y1: this.cordList[0].y,
								x2: this.cordList[1].x,
								y2: this.cordList[1].y,
								x3: -1,
								y3: -1,
								x4: -1,
								y4: -1
							}
						);
					}

					let size = this.cordList.length;
					for (let i = 0; i < size; i++) {
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
	public CircleDrawing(x: number, y: number, type: number): void {

		if (!this.canvas) {
			return;
		} else {
			let canvas: HTMLCanvasElement = document.getElementById('drawingContainer')! as HTMLCanvasElement;
			const ctx = canvas.getContext('2d');

			if (type == 0)
				this.cordList.push({ "x": x, "y": y });

			if (this.cordList.length == 2 || type == 1) {

				let largeur = 0;
				let hauteur = 0;
				let rayon = 0;
				if (ctx) {
					largeur = Math.abs(this.cordList[1].x - this.cordList[0].x);
					hauteur = Math.abs(this.cordList[1].y - this.cordList[0].y);
					rayon = Math.sqrt(largeur * largeur + hauteur * hauteur);

					ctx.beginPath();

					if (this.fill && this.strok) {
						ctx.fillStyle = this.colorFillShape;
						ctx.strokeStyle = this.colorStrokShape;
						ctx.arc(this.cordList[0].x, this.cordList[0].y, rayon, 0, Math.PI * 2, true);
						ctx.fill();
						ctx.stroke();

					} else if (this.fill) {
						ctx.fillStyle = this.colorFillShape;
						ctx.arc(this.cordList[0].x, this.cordList[0].y, rayon, 0, Math.PI * 2, true);
						ctx.fill();

					} else if (this.strok) {
						ctx.strokeStyle = this.colorStrokShape;
						ctx.arc(this.cordList[0].x, this.cordList[0].y, rayon, 0, Math.PI * 2, true);
						ctx.stroke();
					}

					this.shapeList.push(
						{
							type: 3,
							fill: this.fill,
							strok: this.strok,
							colorFillShape: this.colorFillShape,
							colorStrokShape: this.colorStrokShape,
							x1: this.cordList[0].x,
							y1: this.cordList[0].y,
							x2: this.cordList[1].x,
							y2: this.cordList[1].y,
							x3: -1,
							y3: -1,
							x4: -1,
							y4: -1
						}
					);

					let size = this.cordList.length;
					for (let i = 0; i < size; i++) {
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
	public TriangleDrawing(x: number, y: number, type: number): void {
		if (!this.canvas) {
			return;
		} else {
			let canvas: HTMLCanvasElement = document.getElementById('drawingContainer')! as HTMLCanvasElement;
			const ctx = canvas.getContext('2d');

			if (type == 0)
				this.cordList.push({ "x": x, "y": y });

			if (this.cordList.length == 3 || type == 1) {

				if (ctx) {
					ctx.beginPath();

					if (this.fill && this.strok) {
						ctx.fillStyle = this.colorFillShape;
						ctx.strokeStyle = this.colorStrokShape;
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

					} else if (this.strok) {
						ctx.strokeStyle = this.colorStrokShape;
						ctx.moveTo(this.cordList[0].x, this.cordList[0].y);
						ctx.lineTo(this.cordList[1].x, this.cordList[1].y);
						ctx.lineTo(this.cordList[2].x, this.cordList[2].y);
						ctx.lineTo(this.cordList[0].x, this.cordList[0].y);
						ctx.stroke();

					}

					this.shapeList.push(
						{
							type: 4,
							fill: this.fill,
							strok: this.strok,
							colorFillShape: this.colorFillShape,
							colorStrokShape: this.colorStrokShape,
							x1: this.cordList[0].x,
							y1: this.cordList[0].y,
							x2: this.cordList[1].x,
							y2: this.cordList[1].y,
							x3: this.cordList[2].x,
							y3: this.cordList[2].y,
							x4: -1,
							y4: -1
						}
					);

					let size = this.cordList.length;
					for (let i = 0; i < size; i++) {
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
		this.colorCanvas = color;

		const ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.fillStyle = this.colorCanvas;
			ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
		}

		this.drawAllShapes(this.shapeList);
	}

	//--------------------------------------------------------------------------------------
	// METHODE drawAllShapes : permet de dessiner sur le canvas toutes les formes de la 
	//						   liste de formes
	//--------------------------------------------------------------------------------------
	public drawAllShapes(list:
		{
			type: number,
			fill: boolean,
			strok: boolean,
			colorFillShape: string,
			colorStrokShape: string,
			x1: number,
			y1: number,
			x2: number,
			y2: number,
			x3: number,
			y3: number,
			x4: number,
			y4: number
		}[]) {

		let size = list.length;
		for (let i = 0; i < size; i++) {

			switch (list[i].type) {
				case 1:
					this.cordList.push({ "x": list[i].x1, "y": list[i].y1 });
					this.cordList.push({ "x": list[i].x2, "y": list[i].y2 });
					this.lineDrawing(-1, -1, 1);
					break;
				case 2:
					this.cordList.push({ "x": list[i].x1, "y": list[i].y1 });
					this.cordList.push({ "x": list[i].x2, "y": list[i].y2 });
					this.RectDrawing(-1, -1, 1);
					break;
				case 3:
					this.cordList.push({ "x": list[i].x1, "y": list[i].y1 });
					this.cordList.push({ "x": list[i].x2, "y": list[i].y2 });
					this.CircleDrawing(-1, -1, 1);
					break;
				case 4:
					this.cordList.push({ "x": list[i].x1, "y": list[i].y1 });
					this.cordList.push({ "x": list[i].x2, "y": list[i].y2 });
					this.cordList.push({ "x": list[i].x3, "y": list[i].y3 });
					this.TriangleDrawing(-1, -1, 1);
					break;

			}
		}
	}
}


