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

import { environment as env } from '../../../environments/environment';
import { webBrowser } from '../../constants';
import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * The resource that handles http calls to the API to do CRUD operations on projects.
 */
@Injectable()
export class SettingsApiService extends BaseApiService {

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get application specific settings.
   */
  get(): Observable<any> {
    return this.http.get(`${env.apiUrl}/settings`, this.defaultHttpOptions);
  }

  /**
   * Update application specific settings.
   *
   * @param settings The updated settings object.
   */
  update(settings: any): Observable<any> {
    return this.http.put(`${env.apiUrl}/settings`, settings, this.defaultHttpOptions);
  }

  /**
   * Get the supported web drivers.
   */
  getSupportedWebDrivers(): Observable<any> {
    return this.get().pipe(
      map(settings => {
        const supportedWebDrivers = {
          HTMLUNITDRIVER: 'htmlUnit',
          SAFARI: 'safari'
        };

        for (let key in webBrowser) {
          if (key === 'HTML_UNIT' || key === 'SAFARI') continue;
          if (settings.driver[webBrowser[key]].trim() !== '') {
            supportedWebDrivers[key] = webBrowser[key];
          }
        }

        return {
          supportedWebDrivers,
          defaultWebDriver: settings.driver.defaultDriver || webBrowser.HTML_UNIT
        };
      })
    );
  }
}
