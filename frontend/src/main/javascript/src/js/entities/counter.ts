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

/** The counter model. */
export class Counter {

  /** The id of the counter. */
  public id: number;

  /** The name of the counter. */
  public name: string;

  /** The value of the counter. */
  public value: number;

  /** The id of the project. */
  public project: number;

  constructor() {
    this.value = 0;
  }

  static fromData(data: any): Counter {
    const c = new Counter();
    c.id = data.id;
    c.name = data.name;
    c.value = data.value;
    c.project = data.project;
    return c;
  }

  copy(): Counter {
    return Counter.fromData(JSON.parse(JSON.stringify(this)));
  }
}
