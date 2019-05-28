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

export class Resizer {

  private startX: number;
  private startWidth: number;
  private resizeEl: any;
  private containerEl: any;

  constructor(el: any, resizeSel: string, containerSel: string) {
    this.startX = null;
    this.startWidth = null;
    this.resizeEl = el.querySelector(resizeSel);
    this.containerEl = el.querySelector(containerSel);

    this.handleMousemove = this.handleMousemove.bind(this);
    this.handleMouseup = this.handleMouseup.bind(this);
    this.handleMousedown = this.handleMousedown.bind(this);

    this.resizeEl.addEventListener('mousedown', this.handleMousedown);
  }

  private handleMousemove(e) {
    const offsetX = -1 * (e.pageX - this.startX);
    this.containerEl.style.minWidth = this.startWidth + offsetX + "px";
  }

  private handleMouseup(e) {
    window.removeEventListener('mousemove', this.handleMousemove);
    window.removeEventListener('mouseup', this.handleMouseup);
  }

  private handleMousedown(e) {
    this.startX = e.pageX;
    this.startWidth = parseInt(this.containerEl.style.minWidth);
    window.addEventListener('mousemove', this.handleMousemove);
    window.addEventListener('mouseup', this.handleMouseup);
  }
}