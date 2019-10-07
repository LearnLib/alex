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

import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'file-dropzone',
  templateUrl: './file-dropzone.component.html'
})
export class FileDropzoneComponent {

  @Output()
  public loaded: EventEmitter<any>;

  /** The file reader */
  private fileReader: FileReader;

  constructor() {
    this.loaded = new EventEmitter<any>();

    this.fileReader = new FileReader();
    this.fileReader.addEventListener('load', this.onLoad.bind(this));
  }

  /**
   * Is called when the file has been loaded.
   * Emits the loaded files to the EventBus.
   *
   * @param e The event.
   */
  onLoad(e: Event): void {
    this.loaded.emit((<any>e.target).result);
  }

  /**
   * Open a file dialog on a click on the component.
   */
  onClick(): void {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.addEventListener('change', e => {
      this.readFiles((<any>e.target).files);
    }, false);
    input.click();
  }

  /**
   * Handle dragover event.
   *
   * @param e The event.
   */
  onDragover(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }

  /**
   * Handle drop event.
   *
   * @param e The event.
   */
  onDrop(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.readFiles((<any>e).dataTransfer.files);
  }

  /**
   * Read all uploaded files as text.
   *
   * @param files The files to upload.
   */
  readFiles(files: File[]): void {
    for (let i = 0; i < files.length; i++) {
      this.fileReader.readAsText(files[i]);
    }
  }
}
