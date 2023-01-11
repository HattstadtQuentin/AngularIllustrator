import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawingPageComponent } from './drawing_page/drawing-page.component';
import { DrawingZoneComponent } from './drawing_page/drawing-zone/drawing-zone.component';
import { HomePageComponent } from './home_page/home-page.component';
import { HomeZoneComponent } from './home_page/home-zone/home-zone.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'draw', component: DrawingPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}


