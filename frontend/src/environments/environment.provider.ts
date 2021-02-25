/*
* Copyright 2015 - 2021 TU Dortmund
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Env {
  url: string;
}

@Injectable()
export class EnvironmentProvider {
  public apiUrl: string;

  constructor(private readonly http: HttpClient) {
  }

  public load(): Promise<void> {
    return this.http
      .get<Env>('assets/config.json')
      .toPromise()
      .then(env => {
        this.apiUrl = env.url + '/rest';
      });
  }
}

export const initEnv = (env: EnvironmentProvider) => env.load();
