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

import { webBrowser } from '../../../constants';
import { SettingsApiService } from '../../../services/resources/settings-api.service';
import { ToastService } from '../../../services/toast.service';

/**
 * The component for the about page.
 */
export const adminSettingsViewComponent = {
  template: require('html-loader!./admin-settings-view.component.html'),
  controllerAs: 'vm',
  controller: class AdminSettingsViewComponent {

    public settings: any = null;

    public webBrowsers: any = webBrowser;

    /**
     * Constructor.
     *
     * @param settingsApi
     * @param toastService
     */
    /* @ngInject */
    constructor(private settingsApi: SettingsApiService,
                private toastService: ToastService) {

      this.settingsApi.get().subscribe(
        settings => this.settings = settings,
        console.error
      );
    }

    /**
     * Updates the settings.
     */
    updateSettings(): void {
      this.settingsApi.update(this.settings).subscribe(
        () => this.toastService.success('The settings have been updated.'),
        res => this.toastService.danger('<strong>Update failed!</strong> ' + res.data.message)
      );
    }
  }
};
