import {Component} from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-token-sender';

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) 
  {
    localStorage.removeItem('data')
  }
}
