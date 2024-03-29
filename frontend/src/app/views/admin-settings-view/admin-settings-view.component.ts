/*
 * Copyright 2015 - 2022 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component } from '@angular/core';
import { SettingsApiService } from '../../services/api/settings-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'admin-settings-view',
  templateUrl: './admin-settings-view.component.html',
  styleUrls: ['./admin-settings-view.component.scss']
})
export class AdminSettingsViewComponent {

  settings: any;

  constructor(private settingsApi: SettingsApiService,
              private toastService: ToastService) {
    this.init();
  }

  updateSettings(): void {
    this.settingsApi.update(this.settings).subscribe({
      next: () => this.toastService.success('The settings have been updated.'),
      error: res => this.toastService.danger('<strong>Update failed!</strong> ' + res.error.message)
    });
  }

  private init(): void {
    this.settingsApi.get().subscribe({
      next: settings => this.settings = settings,
      error: console.error
    });
  }
}
