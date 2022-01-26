/*
 * Copyright 2015 - 2022 TU Dortmund
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

export class Webhook {
  id: number;
  user: number;
  url: string;
  name: string;
  events: string[];
  method: string;
  headers: any;

  constructor() {
    this.url = 'http://';
    this.events = [];
    this.headers = {};
  }

  static fromData(data: any): Webhook {
    const w = new Webhook();
    w.id = data.id;
    w.user = data.user;
    w.url = data.url;
    w.name = data.name;
    w.method = data.method;
    w.headers = data.headers || {};

    if (data.events != null && data.events.length > 0) {
      w.events = data.events;
    }

    return w;
  }

  hasHeaders(): boolean {
    return Object.keys(this.headers).length > 0;
  }

  addHeader(key: string, value: string): void {
    this.headers[key] = value;
  }

  removeHeader(key: string): void {
    if (typeof this.headers[key] !== 'undefined') {
      delete this.headers[key];
    }
  }

  copy(): Webhook {
    return Webhook.fromData(JSON.parse(JSON.stringify(this)));
  }
}
