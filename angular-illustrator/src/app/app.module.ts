import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './shared_component/nav-bar/nav-bar.component';
import { StatusBarComponent } from './shared_component/status-bar/status-bar.component';
import { ToolBarComponent } from './drawing_page/tool-bar/tool-bar.component';
import { HomeZoneComponent } from './home_page/home-zone/home-zone.component';
import { DrawingZoneComponent } from './drawing_page/drawing-zone/drawing-zone.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DrawingPageComponent } from './drawing_page/drawing-page.component';
import { HomePageComponent } from './home_page/home-page.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    StatusBarComponent,
    ToolBarComponent,
    HomeZoneComponent,
    DrawingZoneComponent,
    DrawingPageComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}