import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-illustrator';
  activeRoute = '';
  isDark = true;

  updateDarkMode(value: boolean) {
    this.isDark = value;
  }

  constructor(
    private actRoute: ActivatedRoute // Activated route to get the current component's information
  ) {}
  ngOnInit() {
    const tmp = this.actRoute.snapshot.paramMap.get('path');
    this.activeRoute = tmp === null ? '' : tmp;
  }
}
