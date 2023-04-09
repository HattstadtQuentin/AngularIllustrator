import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { DrawService } from './services/DrawService';

@Component({
  selector: 'app-drawing-page',
  templateUrl: './drawing-page.component.html',
  styleUrls: ['./drawing-page.component.scss'],
})
export class DrawingPageComponent {
  fileName: string = 'Dessin';
  fileNameSubscription: Subscription = new Subscription();

  constructor(private drawService: DrawService) {}

  ngOnInit() {
    this.fileNameSubscription = this.drawService.fileName.subscribe(
      (fileName: string) => {
        this.fileName = fileName;
      }
    );
  }

  ngOnDestroy() {
    this.fileNameSubscription.unsubscribe();
  }
}
