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

import { Pipe, PipeTransform } from '@angular/core';
import { webBrowser } from '../constants';

@Pipe({
  name: 'formatWebBrowser'
})
export class FormatWebBrowserPipe implements PipeTransform {

  transform(browser: string): string {
    switch (browser) {
      case webBrowser.HTML_UNIT:
        return 'HTML Unit';
      case webBrowser.CHROME:
        return 'Chrome';
      case webBrowser.FIREFOX:
        return 'Firefox';
      case webBrowser.EDGE:
        return 'Edge';
      case webBrowser.SAFARI:
        return 'Safari';
      case webBrowser.REMOTE:
        return 'Remote driver';
      case webBrowser.IE:
        return 'Internet Explorer';
      default:
        return browser;
    }
  }
}
