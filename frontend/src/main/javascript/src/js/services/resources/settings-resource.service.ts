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

import {apiUrl} from '../../../../environments';
import {webBrowser} from '../../constants';
import {IHttpService, IPromise} from 'angular';

/**
 * The resource that handles http calls to the API to do CRUD operations on projects.
 */
export class SettingsResource {

  /**
   * Constructor.
   *
   * @param $http
   */
  /* @ngInject */
  constructor(private $http: IHttpService) {
  }

  /**
   * Get application specific settings.
   */
  get(): IPromise<any> {
    return this.$http.get(`${apiUrl}/settings`)
      .then(response => response.data);
  }

  /**
   * Update application specific settings.
   *
   * @param settings The updated settings object.
   */
  update(settings: any): IPromise<any> {
    return this.$http.put(`${apiUrl}/settings`, settings)
      .then(response => response.data);
  }

  /**
   * Get the supported web drivers.
   */
  getSupportedWebDrivers(): IPromise<any> {
    return this.get().then(settings => {
      let supportedWebDrivers = {
        HTMLUNITDRIVER: 'htmlUnit',
        SAFARI: 'safari',
      };

      for (let key in webBrowser) {
        if (key === 'HTML_UNIT' || key === 'SAFARI') continue;
        if (settings.driver[webBrowser[key]].trim() !== '') {
          supportedWebDrivers[key] = webBrowser[key];
        }
      }

      return {
        supportedWebDrivers: supportedWebDrivers,
        defaultWebDriver: settings.driver.defaultDriver || webBrowser.HTML_UNIT
      };
    });
  }
}
