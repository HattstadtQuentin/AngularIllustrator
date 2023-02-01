import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faRightFromBracket, faMoon, faAngleDown, faSun, faS } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})

export class NavBarComponent {
  @Input() isDark = false; 
  faRightFromBracket = faRightFromBracket;
  faIcon = faSun;
  faAngleDown = faAngleDown;

  @Output() update = new EventEmitter<boolean>();

  toggleDarkMode() {
    this.isDark = !this.isDark;
    if(this.isDark){
      this.faIcon = faMoon;
    } else {
      this.faIcon = faSun;
    }
    this.update.emit(this.isDark);
  }
}
