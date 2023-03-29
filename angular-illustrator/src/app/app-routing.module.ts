import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawingPageComponent } from './drawing_page/drawing-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'project', pathMatch: 'full' },
  { path: 'project', component: DrawingPageComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
