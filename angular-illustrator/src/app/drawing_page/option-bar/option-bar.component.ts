import { Component, ViewContainerRef } from '@angular/core';
import { ColorPickerService } from 'ngx-color-picker';
import { ToastrService } from 'ngx-toastr';
import { PaperSizes, paperSizesMap } from '../paperSizes.enum';

@Component({
  selector: 'app-option-bar',
  templateUrl: './option-bar.component.html',
  styleUrls: ['./option-bar.component.scss']
})
export class OptionBarComponent {
  isPage = true;
  isPortrait = true;
  regleCheckboxValue: boolean = false;
  grilleCheckboxValue: boolean = false;
  color: string = '#000000'; 
  options = Object.values(PaperSizes).map(size => {
    return `${size.title}(${size.description})`;
  });
  selectedOption = PaperSizes.A4.title + "(" + PaperSizes.A4.description + ")";

  constructor(public vcRef: ViewContainerRef, private cpService: ColorPickerService, private toastr: ToastrService) {}

  public onEventLog(event: string, data: any): void {
    console.log(event, data);
  }

  public onChangeColor(color: string): void {
    console.log('Color changed:', color);
  }


  updatePaperSelection(event: Event) {
    if (event.target instanceof HTMLSelectElement) {
      this.selectedOption = event.target.value;
    }
  }

  updateRegleCheckboxValue(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      this.regleCheckboxValue = event.target.checked;
    }
  }

  updateGrilleCheckboxValue(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      this.grilleCheckboxValue = event.target.checked;
    }
  }

  setIsPage(isPage: boolean) {
    this.isPage = isPage;
  }

  showIsCopied() {
    this.toastr.success('Copié dans le presse-papier');
  }


  selectedOrientation: string = 'portrait';
  radioOptions = [
    { value: 'portrait', label: 'Portrait' },
    { value: 'paysage', label: 'Paysage' },
  ];

  onOptionSelected(value: string) {
    this.selectedOrientation = value;
    if(this.selectedOrientation == 'portrait'){
      this.isPortrait = true;
    } else {
      this.isPortrait = false;
    }
  }
}
