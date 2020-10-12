/*
 * Copyright 2015 - 2020 TU Dortmund
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

import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentProvider } from "../../../environments/environment.provider";

/**
 * The resource that handles http calls to the API to do CRUD operations on projects.
 */
@Injectable()
export class SettingsApiService extends BaseApiService {

  constructor(private http: HttpClient, private env: EnvironmentProvider) {
    super();
  }

  /**
   * Get application specific settings.
   */
  get(): Observable<any> {
    return this.http.get(`${this.env.apiUrl}/settings`, this.defaultHttpOptions);
  }

  /**
   * Update application specific settings.
   *
   * @param settings The updated settings object.
   */
  update(settings: any): Observable<any> {
    return this.http.put(`${this.env.apiUrl}/settings`, settings, this.defaultHttpOptions);
  }
}
