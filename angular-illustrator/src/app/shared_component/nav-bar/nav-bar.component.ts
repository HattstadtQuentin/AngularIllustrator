import { Component } from '@angular/core';
import { faRightFromBracket, faMoon, faAngleDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  faRightFromBracket = faRightFromBracket;
  faMoon = faMoon;
  faAngleDown = faAngleDown;
}
