import { Component } from '@angular/core';
import { AppStoreService } from './services/app-store.service';

@Component({
  selector: 'root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public appStore: AppStoreService) {
  }
}
