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

@Pipe({
  name: 'formatMilliseconds'
})
export class FormatMillisecondsPipe implements PipeTransform {

  transform(ms: number): string {
    let hours;
    let minutes;
    let seconds;

    if (ms >= 3600000) {
      hours = Math.floor(ms / 3600000);
      ms = ms % 3600000;
      minutes = Math.floor(ms / 60000);
      seconds = Math.floor((ms % 60000) / 1000);
      return hours + 'h ' + minutes + 'min ' + seconds + 's';
    } else if (ms >= 60000) {
      minutes = Math.floor(ms / 60000);
      return minutes + 'min ' + Math.floor((ms % 60000) / 1000) + 's';
    } else {
      seconds = Math.floor(ms / 1000);
      return seconds + 's ' + (ms % 1000) + 'ms';
    }
  }
}
