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
import { AppStoreService } from '../../services/app-store.service';
import { FileApiService, UploadProgress } from '../../services/api/file-api.service';
import { Project } from '../../entities/project';
import { BehaviorSubject, Observable } from 'rxjs';
import { UploadableFile } from '../../entities/uploadable-file';
import { Selectable } from '../../utils/selectable';
import { ToastService } from '../../services/toast.service';
import { removeItems } from '../../utils/list-utils';

@Injectable()
export class FilesViewStoreService {

  public readonly filesSelectable: Selectable<UploadableFile, number>;
  public filesToUpload: Map<string, UploadProgress>;
  private readonly files: BehaviorSubject<UploadableFile[]>;

  constructor(private appStore: AppStoreService,
              private fileApi: FileApiService,
              private toastService: ToastService) {
    this.files = new BehaviorSubject<UploadableFile[]>([]);
    this.filesToUpload = new Map();
    this.filesSelectable = new Selectable<UploadableFile, number>(f => f.id);
  }

  get noFilesToUploadOrOnlyErrors(): boolean {
    return this.filesToUpload.size === 0 || Array.from(this.filesToUpload.values())
      .reduce((acc, val) => acc && val.error, true);
  }

  get files$(): Observable<UploadableFile[]> {
    return this.files.asObservable();
  }

  private get project(): Project {
    return this.appStore.project;
  }

  load(): void {
    this.fileApi.getAll(this.project.id).subscribe(
      files => {
        this.files.next(files);
        this.filesSelectable.addItems(files);
      }
    );
  }

  /**
   * Remove a single file from the server and the list.
   *
   * @param file The name of the file to delete.
   */
  deleteFile(file: UploadableFile): void {
    this.fileApi.remove(this.project.id, file).subscribe(
      () => {
        this.toastService.success(`File "${file.name}" has been deleted.`);
        this.files.next(removeItems(this.files.value, f => f.id === file.id));
        this.filesSelectable.remove(file);
      },
      res => {
        this.toastService.danger(`The file could not be deleted. ${res.error.message}`);
      }
    );
  }

  /**
   * Batch delete selected files.
   */
  deleteSelectedFiles(): void {
    const selectedFiles = this.filesSelectable.getSelected();
    if (selectedFiles.length === 0) {
      this.toastService.info('You have to select at least one file');
    } else {
      this.fileApi.removeMany(this.project.id, selectedFiles).subscribe(
        () => {
          const ids = selectedFiles.map(f => f.id);
          this.toastService.success(`The files have been deleted.`);
          this.files.next(removeItems(this.files.value, f => ids.indexOf(f.id) > -1));
          this.filesSelectable.removeMany(selectedFiles);
        },
        res => {
          this.toastService.danger(`The files could not be deleted. ${res.error.message}`);
        }
      );
    }
  }

  /**
   * Downloads a file.
   *
   * @param file The file to download.
   */
  downloadFile(file: UploadableFile): void {
    this.fileApi.download(this.project.id, file).subscribe(
      response => {
        const blob = response.body;
        const objectUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = file.name;
        a.click();

        window.URL.revokeObjectURL(objectUrl);
      }
    );
  }

  uploadFiles(e: Event): void {
    this.filesToUpload.clear();

    const files = (e.target as any).files as File[];

    const queue = [...files];
    const next = () => {
      if (queue.length === 0) {
        return;
      }

      const file = queue.shift();
      this.fileApi.upload(this.project.id, file).subscribe(
        data => {
          this.filesToUpload.set(file.name, data);
          if (data.file != null) {
            this.files.next([...this.files.value, data.file]);
            this.filesSelectable.addItem(data.file);
            this.filesToUpload.delete(file.name);
          }
        },
        err => {
          console.error(err);
          next();
        },
        () => next()
      );
    };

    next();
  }
}
