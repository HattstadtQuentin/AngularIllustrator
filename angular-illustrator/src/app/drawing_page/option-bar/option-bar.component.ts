import { Component, ViewContainerRef, Renderer2, ElementRef } from '@angular/core';
import { ColorPickerService } from 'ngx-color-picker';
import { ToastrService } from 'ngx-toastr';
import { Options } from '@angular-slider/ngx-slider';
import { PaperSizes } from '../paperSizes.enum';
import { FormControl, Validators } from '@angular/forms';

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
  color1: string = "#000000";
  options = Object.values(PaperSizes).map(size => {
    return `${size.title}(${size.description})`;
  });
  selectedOption = PaperSizes.A4.title + "(" + PaperSizes.A4.description + ")";

  constructor(
    public vcRef: ViewContainerRef, 
    private cpService: ColorPickerService, 
    private toastr: ToastrService, 
    private renderer: Renderer2, 
    private el: ElementRef
  ) {}

  public onEventLog(event: string, data: any): void {
    console.log(event, data);
  }

  public onChangeColor(color: string): void {
    console.log('Color changed:', color);
  }

  public onChangeColor1(color: string): void {
    console.log('Color change', this.color1);
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

  optionsSlider: Options = {
    floor: 0,
    ceil: 50
  };
  thickness: number = 25;

  formControlThickness = new FormControl();
  thicknessInputValid = true;
  ngOnInit() {
    this.formControlThickness.valueChanges.subscribe(x => {
      if(x === null){
        this.thicknessInputValid = false;
      } else {
        this.thicknessInputValid = true;
        this.thickness = x;
      }
    })
  }

  onValueChangeThickness(value: number) {
    this.thickness = value;
    this.thicknessInputValid = true;
  }
}
