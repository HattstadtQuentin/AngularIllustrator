import { Component, OnInit, ElementRef, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { timeouts } from 'retry';
import { lookup } from 'dns/promises';
import { Tools } from '../tools.enum';

//variable globale pour sortir de la boucle while du mouseDown event
let press = 1;

@Component({
	selector: 'app-drawing-zone',
	templateUrl: './drawing-zone.component.html',
	styleUrls: ['./drawing-zone.component.scss']
})


export class DrawingZoneComponent implements OnInit {
	@ViewChild('canvas') canvasRef: ElementRef;
	@Input() activeTool = Tools.Line; 

	//--------------------------------------------------------------------------------------
	// DECLARATION DES ATTRIBUTS
	//--------------------------------------------------------------------------------------
	public title: string;
	public nbClick: number;
	public x: number;
	public y: number;
	public cordList: { x: number, y: number }[];
	public canvas?: HTMLCanvasElement;
	public context!: CanvasRenderingContext2D;

	//--------------------------------------------------------------------------------------
	// CONSTRUCTEUR 
	//--------------------------------------------------------------------------------------
	constructor(private changeRef: ChangeDetectorRef, private elementRef: ElementRef) {
		this.title = 'Espace de dessin';
		this.nbClick = 0;
		this.x = 0;
		this.y = 0;
		this.cordList = [];
		this.canvasRef = new ElementRef(null);
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

	resizeCanvas(): void {
		if (!this.canvasRef.nativeElement) {
			console.log('no ref');
			return;
		}

	
		const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
		const parent = canvas.parentElement as HTMLElement;
		canvas.width = parent.offsetWidth;
		canvas.height = parent.offsetHeight;
	}


	//--------------------------------------------------------------------------------------
	//
	//--------------------------------------------------------------------------------------
	ngAfterViewInit() {
		this.canvas = this.canvasRef.nativeElement;

		this.elementRef.nativeElement.querySelector('#drawingContainer')
			.addEventListener('click', this.draw.bind(this));

		this.elementRef.nativeElement.querySelector('#drawingContainer')
			.addEventListener('mousedown', this.prevision.bind(this));

		//this.elementRef.nativeElement.querySelector('#drawingContainer')
		//	.addEventListener('mouseup', this.draw.bind(this));
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
	// METHODE draw : lié à l'event mouseUP, va dessiner la forme choisie
	//--------------------------------------------------------------------------------------
	public draw(e: MouseEvent): void {
		switch(this.activeTool){
			case Tools.Select:
				break;
			case Tools.Selection:
				break;
			case Tools.Draw:
				break;
			case Tools.Line:
				this.lineDrawing(e);
				break;
			case Tools.Box:
				this.RectDrawing(e);
				break;
			case Tools.Circle:
				this.CircleDrawing(e);
				break;
			case Tools.Triangle:
				this.TriangleDrawing(e);
				break;
			case Tools.Eraser:
				break;
		}
	}


	//--------------------------------------------------------------------------------------
	// METHODE lineDrawing : permet de dessiner une ligne sur le canvas avec deux clicks
	//						 de souris simulant le debut et la fin de la ligne.
	//--------------------------------------------------------------------------------------
	public lineDrawing(e: MouseEvent): void {
		if(!this.canvas){
			return;
		} else {
			this.x = e.clientX - this.canvas.offsetLeft;
			this.y = e.clientY - this.canvas.offsetTop;
			this.nbClick++;
			this.cordList.push({ "x": this.x, "y": this.y });

			let canvas: HTMLCanvasElement = document.getElementById('drawingContainer')! as HTMLCanvasElement;
			const ctx = canvas.getContext('2d');


			if (this.cordList.length == 2) {

				let index = 0;
				if (ctx) {
					ctx.moveTo(this.cordList[0].x, this.cordList[0].y);
					ctx.lineTo(this.cordList[1].x, this.cordList[1].y);
					ctx.stroke();

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
	public RectDrawing(e: MouseEvent): void {
		if(!this.canvas){
			return;
		} else {
			this.x = e.clientX - this.canvas.offsetLeft;
			this.y = e.clientY - this.canvas.offsetTop;
			this.cordList.push({ "x": this.x, "y": this.y });
			console.log({ "x": this.x, "y": this.y });

			let canvas: HTMLCanvasElement = document.getElementById('drawingContainer')! as HTMLCanvasElement;
			const ctx = canvas.getContext('2d');


			if (this.cordList.length == 2) {

				let largeur = 0;
				let hauteur = 0;
				if (ctx) {
					largeur = this.cordList[1].x - this.cordList[0].x;
					hauteur = this.cordList[1].y - this.cordList[0].y;

					ctx.fillRect(this.cordList[0].x, this.cordList[0].y, largeur, hauteur);

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
	public CircleDrawing(e: MouseEvent): void {

		if(!this.canvas){
			return;
		} else {
			this.x = e.clientX - this.canvas.offsetLeft;
			this.y = e.clientY - this.canvas.offsetTop;
			this.cordList.push({ "x": this.x, "y": this.y });

			let canvas: HTMLCanvasElement = document.getElementById('drawingContainer')! as HTMLCanvasElement;
			const ctx = canvas.getContext('2d');


			if (this.cordList.length == 2) {

				let largeur = 0;
				let hauteur = 0;
				let rayon = 0;
				if (ctx) {
					largeur = Math.abs(this.cordList[1].x - this.cordList[0].x);
					hauteur = Math.abs(this.cordList[1].y - this.cordList[0].y);
					rayon = Math.sqrt(largeur * largeur + hauteur * hauteur);

					ctx.beginPath();
					ctx.arc(this.cordList[0].x, this.cordList[0].y, rayon, 0, Math.PI * 2, true);
					ctx.stroke();
					ctx.fill();

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
	public TriangleDrawing(e: MouseEvent): void {
		if(!this.canvas){
			return;
		} else {
			this.x = e.clientX - this.canvas.offsetLeft;
			this.y = e.clientY - this.canvas.offsetTop;
			this.cordList.push({ "x": this.x, "y": this.y });

			let canvas: HTMLCanvasElement = document.getElementById('drawingContainer')! as HTMLCanvasElement;
			const ctx = canvas.getContext('2d');


			if (this.cordList.length == 3) {

				if (ctx) {
					ctx.beginPath();
					ctx.moveTo(this.cordList[0].x, this.cordList[0].y);
					ctx.lineTo(this.cordList[1].x, this.cordList[1].y);
					ctx.lineTo(this.cordList[2].x, this.cordList[2].y);
					ctx.fill();

					let size = this.cordList.length;
					for (let i = 0; i < size; i++) {
						this.cordList.pop();
					}
				}
			}
		}
	}
}


