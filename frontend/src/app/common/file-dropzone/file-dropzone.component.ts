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

import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface FileLoadedData {
  filename: string;
  data: string;
}

@Component({
  selector: 'file-dropzone',
  templateUrl: './file-dropzone.component.html'
})
export class FileDropzoneComponent {

  @Input()
  multiple: boolean;

  @Output()
  loaded: EventEmitter<FileLoadedData>;

  private fileReader: FileReader;

  constructor() {
    this.multiple = true;
    this.loaded = new EventEmitter<FileLoadedData>();
    this.fileReader = new FileReader();
  }

  /**
   * Is called when the file has been loaded.
   *
   * @param e The event.
   * @param filename The filename.
   */
  onLoadEnd(e: Event, file: File): void {
    this.loaded.emit({
      filename: file.name,
      data: (e.target as any).result
    });
  }

  /**
   * Open a file dialog on a click on the component.
   */
  onClick(): void {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('multiple', `${this.multiple}`);
    input.addEventListener('change', e => {
      const files = (e.target as any).files;
      this.readFiles(files);
    }, false);
    input.click();
  }

  /**
   * Read all uploaded files as text.
   *
   * @param files The files to upload.
   */
  readFiles(files: File[]): void {
    for (const file of files) {
      this.fileReader.onloadend = ((f) => (e) => this.onLoadEnd(e, f))(file);
      this.fileReader.readAsText(file);
    }
  }
}
