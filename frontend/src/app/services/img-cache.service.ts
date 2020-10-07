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

import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class ImgCacheService {

  private cache: Map<string, BehaviorSubject<string>>;

  private currentResultId: any;

  constructor() {
    this.cache = new Map<string, BehaviorSubject<string>>();
  }

  public get(src: string): BehaviorSubject<string> {
    if (!src.includes('/results/' + this.currentResultId)) {
      return null;
    }
    return this.cache.get(src);
  }

  public put(src: string, img: BehaviorSubject<string>) {
    if (!src.includes('/results/' + this.currentResultId)) {
      this.currentResultId = Number(src.match(/\/results\/(?=(\d+))/).pop());
      this.cache.clear();
    }
    this.cache.set(src, img);
  }

  public has(src: string): boolean {
    if (!src.includes('/results/' + this.currentResultId)) {
      return false;
    }
    return this.cache.has(src);
  }
}
