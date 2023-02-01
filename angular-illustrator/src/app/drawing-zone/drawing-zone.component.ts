import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { timeouts } from 'retry';
import { lookup } from 'dns/promises';

let press = 1;

@Component({
  selector: 'app-drawing-zone',
  templateUrl: './drawing-zone.component.html',
  styleUrls: ['./drawing-zone.component.scss']
})


export class DrawingZoneComponent implements OnInit {

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
  private myCanvas!: ElementRef<HTMLCanvasElement>;

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

  ngOnInit() {
    //Nothing yet
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.querySelector('#drawingContainer')
      .addEventListener('click', this.lineDrawing.bind(this));

    this.elementRef.nativeElement.querySelector('#drawingContainer')
      .addEventListener('mousedown', this.prevision.bind(this));

    this.elementRef.nativeElement.querySelector('#drawingContainer')
      .addEventListener('mouseup', this.draw.bind(this));
  }

  public prevision(e: MouseEvent): void {

    //TODO : arriver à detecter le mouseUp Event pour quitter le while

    /*
    while (press == 1) {
      console.log("mousedown");
    }
    */

  }

  public draw(e: MouseEvent): void {

    press = 0;
    console.log("mouseup");
  }


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

        this.cordList.pop();
        this.cordList.pop();
      }

    }

  }



}


