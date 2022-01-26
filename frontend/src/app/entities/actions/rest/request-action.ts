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

import { actionType } from '../../../constants';
import { Action } from '../action';

/**
 * Checks in a HTTP response body that is formatted in JSON if a specific attribute exists.
 * E.g. object.attribute.anotherAttribute.
 */
export class CallRestAction extends Action {

  /** The HTTP method in {GET,POST,PUT,DELETE}. */
  public method: string;

  /** The URL the request is send to. */
  public url: string;

  /** The body data for POST and PUT requests. */
  public data?: string;

  /** The cookies to send with the request. */
  public cookies: any;

  /** The HTTP headers of the request. */
  public headers: any;

  /** The HTTP Basic auth credentials of the request (optional). */
  public credentials: any;

  /** The amount of time in ms before the request times out. */
  public timeout: number;

  public baseUrl: string;

  /**
   * Constructor.
   *
   * @param obj The object to create the action from.
   */
  constructor(obj: any = {}) {
    super(actionType.REST_CALL, obj);

    this.method = obj.method || 'GET';
    this.url = obj.url || '';
    this.data = obj.data || null;
    this.cookies = obj.cookies || {};
    this.headers = obj.headers || {};
    this.credentials = obj.credentials || {};
    this.timeout = obj.timeout == null ? 0 : obj.timeout;
    this.baseUrl = obj.baseUrl;
  }

  hasHeaders(): boolean {
    return Object.keys(this.headers).length > 0;
  }

  hasCookies(): boolean {
    return Object.keys(this.cookies).length > 0;
  }

  /**
   * Adds a cookie to the action.
   *
   * @param key The cookie key.
   * @param value The cookie value.
   */
  addCookie(key: string, value: string): void {
    this.cookies[key] = value;
  }

  /**
   * Removes a cookie from the action.
   *
   * @param key The key of the cookie.
   */
  removeCookie(key: string): void {
    if (typeof this.cookies[key] !== 'undefined') {
      delete this.cookies[key];
    }
  }

  /**
   * Adds a header field entry to the action.
   *
   * @param key The Http header field name.
   * @param value The Http header field value.
   */
  addHeader(key: string, value: string): void {
    this.headers[key] = value;
  }

  /**
   * Removes a header field entry.
   *
   * @param key The key of the Http header entry.
   */
  removeHeader(key: string): void {
    if (typeof this.headers[key] !== 'undefined') {
      delete this.headers[key];
    }
  }

  toString(): string {
    return 'Make a ' + this.method + ' request to "' + this.url + '"';
  }
}
