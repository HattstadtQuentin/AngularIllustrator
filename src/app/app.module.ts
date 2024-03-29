import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolBarComponent } from './drawing_page/tool-bar/tool-bar.component';
import { DrawingZoneComponent } from './drawing_page/drawing-zone/drawing-zone.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DrawingPageComponent } from './drawing_page/drawing-page.component';
import { OptionBarComponent } from './drawing_page/option-bar/option-bar.component';
import { ToolsSearchComponent } from './drawing_page/tool-bar/tools-search/tools-search.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatOptionModule } from '@angular/material/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { ClipboardModule } from 'ngx-clipboard';
import { ToastrModule } from 'ngx-toastr';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ToolBarComponent,
    DrawingZoneComponent,
    DrawingPageComponent,
    OptionBarComponent,
    ToolsSearchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatOptionModule,
    ColorPickerModule,
    ClipboardModule,
    ToastrModule.forRoot(),
    NgxSliderModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
