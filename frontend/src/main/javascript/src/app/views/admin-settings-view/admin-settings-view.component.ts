/*
 * Copyright 2015 - 2019 TU Dortmund
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
import { webBrowser } from '../../constants';
import { SettingsApiService } from '../../services/api/settings-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'admin-settings-view',
  templateUrl: './admin-settings-view.component.html',
  styleUrls: ['./admin-settings-view.component.scss']
})
export class AdminSettingsViewComponent {

  webBrowsers: any = webBrowser;

  settings: any;

  constructor(private settingsApi: SettingsApiService,
              private toastService: ToastService) {
    this.init();
  }

  private init(): void {
    this.settingsApi.get().subscribe(
      settings => this.settings = settings,
      console.error
    );
  }

  updateSettings(): void {
    this.settingsApi.update(this.settings).subscribe(
      () => this.toastService.success('The settings have been updated.'),
      res => this.toastService.danger('<strong>Update failed!</strong> ' + res.error.message)
    );
  }

  makeDriverDefault(driver: string): void {
    if (this.settings.driver.defaultDriver !== driver) {
      this.settings.driver.defaultDriver = driver;
    } else {
      this.settings.driver.defaultDriver = webBrowser.HTML_UNIT;
    }
  }

  uploadDriver(driver: string, file: File): void {
    this.settingsApi.uploadDriver(driver, file).subscribe(
      () => this.init(),
      err => this.toastService.danger(err)
    );
  }

  deleteDriver(driver: string): void {
    this.settingsApi.deleteDriver(driver).subscribe(
      () => this.init(),
      err => this.toastService.danger(err)
    );
  }

  canMakeDefault(driver: string): boolean {
    const d = this.settings.driver[driver];
    return d != null && d.trim() !== '';
  }

  getDefaultButtonClass(driver: string): any {
    const isDefault = this.settings.driver.defaultDriver === driver;
    return {
      'btn-default': !isDefault,
      'btn-primary': isDefault
    };
  }
}
