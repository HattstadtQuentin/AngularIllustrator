import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { timeouts } from 'retry';
import { lookup } from 'dns/promises';

//variable globale pour sortir de la boucle while du mouseDown event
let press = 1;

@Component({
	selector: 'app-drawing-zone',
	templateUrl: './drawing-zone.component.html',
	styleUrls: ['./drawing-zone.component.scss']
})


export class DrawingZoneComponent implements OnInit {

	//--------------------------------------------------------------------------------------
	// DECLARATION DES ATTRIBUTS
	//--------------------------------------------------------------------------------------
	public title: string;
	public nbClick: number;
	public x: number;
	public y: number;
	public cordList: { x: number, y: number }[];
	public x_canvas: number;
	public y_canvas: number;
	public x_canvas_size: number;
	public y_canvas_size: number;
	public context!: CanvasRenderingContext2D;

	//--------------------------------------------------------------------------------------
	// CONSTRUCTEUR 
	//--------------------------------------------------------------------------------------
	constructor(private changeRef: ChangeDetectorRef, private elementRef: ElementRef) {
		this.title = 'Espace de dessin';
		this.nbClick = 0;
		this.x = 0
		this.y = 0;
		this.cordList = [];
		this.x_canvas = screen.width * 0.2 + 45;
		this.y_canvas = screen.height * 0.35 - 25;
		this.x_canvas_size = screen.width * 0.8;
		this.y_canvas_size = screen.height * 0.65;
	}


	//--------------------------------------------------------------------------------------
	//
	//--------------------------------------------------------------------------------------
	ngOnInit() {
		//Nothing yet
	}


	//--------------------------------------------------------------------------------------
	//
	//--------------------------------------------------------------------------------------
	ngAfterViewInit() {

		this.elementRef.nativeElement.querySelector('#drawingContainer')
			.addEventListener('click', this.RectDrawing.bind(this));

		this.elementRef.nativeElement.querySelector('#drawingContainer')
			.addEventListener('mousedown', this.prevision.bind(this));

		this.elementRef.nativeElement.querySelector('#drawingContainer')
			.addEventListener('mouseup', this.draw.bind(this));
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

		//TODO : en fonction de la forme choisie, appeler la bonne méthode de dessin
		//		 (lineDrawing, RectDrawing, CircleDrawing, TriangleDrawing, etc.)

		press = 0;
		console.log("mouseup");
	}


	//--------------------------------------------------------------------------------------
	// METHODE lineDrawing : permet de dessiner une ligne sur le canvas avec deux clicks
	//						 de souris simulant le debut et la fin de la ligne.
	//--------------------------------------------------------------------------------------
	public lineDrawing(e: MouseEvent): void {
		this.nbClick++;
		this.x = e.clientX - this.x_canvas;
		this.y = e.clientY - this.y_canvas;
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


	//--------------------------------------------------------------------------------------
	// METHODE RectDrawing : permet de dessiner un rectangle sur le canvas avec deux clicks
	//						 de souris simulant le debut et la fin de la diagonale du rect.
	//--------------------------------------------------------------------------------------
	public RectDrawing(e: MouseEvent): void {

		this.x = e.clientX - this.x_canvas;
		this.y = e.clientY - this.y_canvas;
		this.cordList.push({ "x": this.x, "y": this.y });

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


	//--------------------------------------------------------------------------------------
	// METHODE CircleDrawing : permet de dessiner un cercle sur le canvas avec deux clicks
	//						 de souris simulant le debut et la fin du rayon du cercle.
	//--------------------------------------------------------------------------------------
	public CircleDrawing(e: MouseEvent): void {

		this.x = e.clientX - this.x_canvas;
		this.y = e.clientY - this.y_canvas;
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


	//--------------------------------------------------------------------------------------
	// METHODE TriangleDrawing : permet de dessiner un triangle sur le canvas avec trois clicks
	//						 de souris simulant les 3 sommets du triangle.
	//--------------------------------------------------------------------------------------
	public TriangleDrawing(e: MouseEvent): void {

		this.x = e.clientX - this.x_canvas;
		this.y = e.clientY - this.y_canvas;
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


