import { Component } from '@angular/core';
import { AppStoreService } from '../../services/app-store.service';

@Component({
  selector: 'app-view',
  templateUrl: './app-view.component.html',
  styleUrls: ['./app-view.component.scss']
})
export class AppViewComponent {

  constructor(public appStore: AppStoreService) { }

  get username(): string {
    return this.appStore.user.email.split('@')[0];
  }
}
