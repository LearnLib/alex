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

import { Injectable } from '@angular/core';

export enum ClipboardMode {
  COPY = 'copy',
  CUT = 'cut',
}

/**
 * The factory for the Clipboard.
 */
@Injectable()
export class ClipboardService {

  private clipboard;

  /** Constructor. */
  constructor() {
    const clipboard = localStorage.getItem('clipboard');
    if (clipboard == null) {
      this.clipboard = {};
      this.persist();
    } else {
      this.clipboard = JSON.parse(clipboard);
    }
  }

  /**
   * Copies an item to the Clipboard.
   *
   * @param projectId The ID of the project.
   * @param key The key the data is saved under.
   * @param data The data to copy to the clipboard.
   * @param mode The mode for copying.
   */
  copy(projectId: number, key: string, data: any, mode = ClipboardMode.COPY): void {
    if (this.clipboard[projectId] == null) {
      this.clipboard[projectId] = {};
    }

    this.clipboard[projectId][key] = {
      data,
      mode
    };

    this.persist();
  }

  /**
   * Pastes an item from the clipboard. Deletes the item if mode has been 'cut'.
   *
   * @param projectId The ID of the project.
   * @param key The key whose data to get.
   * @returns The data.
   */
  paste(projectId: number, key: string): any {
    const entry = this.clipboard[projectId][key];
    if (entry) {
      if (entry.mode === ClipboardMode.CUT) {
        delete this.clipboard[projectId][key];
        this.persist();
      }
      return entry.data;
    } else {
      return null;
    }
  }

  /** Clear the clipboard. */
  clear(): void {
    this.clipboard = {};
    this.persist();
  }

  canPaste(projectId: number, key: string): boolean {
    return this.clipboard[projectId] != null && this.clipboard[projectId][key] != null;
  }

  private persist(): void {
    localStorage.setItem('clipboard', JSON.stringify(this.clipboard));
  }
}
