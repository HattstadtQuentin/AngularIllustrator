import { Component, ViewContainerRef, Renderer2, ElementRef, EventEmitter, Output } from '@angular/core';
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
  color: string = '#1A1F39';
  fillColor: string = "#000000";
  strokeColor: string = "#000000";
  options = Object.values(PaperSizes).map(size => {
    return `${size.title}(${size.description})`;
  });
  selectedOption = PaperSizes.A4.title + "(" + PaperSizes.A4.description + ")";
  @Output() updateBackgroundColor = new EventEmitter<string>();
  @Output() updateFillColor = new EventEmitter<string>();
  @Output() updateStrokeColor = new EventEmitter<string>();


  constructor(
    public vcRef: ViewContainerRef,
    private cpService: ColorPickerService,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private el: ElementRef,
  ) { }

  public onEventLog(event: string, data: any): void {
    if (event == "colorPickerClose" && typeof data === 'string') {
      this.updateBackgroundColor.emit(data);
    }
  }

  public onEventLogFill(event: string, data: any): void {
    if (event == "colorPickerClose" && typeof data === 'string') {
      this.updateFillColor.emit(data);
    }
  }

  public onEventLogStroke(event: string, data: any): void {
    if (event == "colorPickerClose" && typeof data === 'string') {
      this.updateStrokeColor.emit(data);
    }
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
    if (this.selectedOrientation == 'portrait') {
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
      if (x === null) {
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


