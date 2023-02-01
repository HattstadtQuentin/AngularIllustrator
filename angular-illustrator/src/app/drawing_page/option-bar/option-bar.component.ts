import { Component } from '@angular/core';

@Component({
  selector: 'app-option-bar',
  templateUrl: './option-bar.component.html',
  styleUrls: ['./option-bar.component.scss']
})
export class OptionBarComponent {
  isPage = true;

  setIsPage(isPage: boolean) {
    this.isPage = isPage;
  }
}
