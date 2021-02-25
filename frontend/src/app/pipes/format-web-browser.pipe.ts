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

import { Pipe, PipeTransform } from '@angular/core';
import { WebDriverConfig } from '../entities/web-driver-config';

@Pipe({
  name: 'formatWebBrowser'
})
export class FormatWebBrowserPipe implements PipeTransform {

  private browsers = {};

  constructor() {
    for (const key in WebDriverConfig.Browsers) {
      if (WebDriverConfig.Browsers.hasOwnProperty(key)) {
        this.browsers[WebDriverConfig.Browsers[key as string]] = key;
      }
    }
  }

  transform(value: string, ...args: string[]): string {
    return this.browsers[value];
  }
}
