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

import * as remove from 'lodash/remove';
import {apiUrl} from '../../../../../environments';
import {Selectable} from '../../../utils/selectable';
import {ToastService} from '../../../services/toast.service';
import {FileResource} from '../../../services/resources/file-resource.service';
import {ProjectService} from '../../../services/project.service';
import {Project} from '../../../entities/project';
import { UploadableFile } from '../../../entities/uploadable-file';

/**
 * The controller of the files page.
 */
class FilesViewComponent {

  /** All project related files. */
  public files: UploadableFile[];

  /** The selected files. */
  public selectedFiles: Selectable<UploadableFile>;

  /** The progress in percent of the current uploading file. */
  public progress: number;

  /** The list of files to upload. */
  public filesToUpload: any[];

  /**
   * Constructor.
   *
   * @param Upload
   * @param toastService
   * @param fileResource
   * @param projectService
   */
  /* @ngInject */
  constructor(private Upload: any,
              private toastService: ToastService,
              private fileResource: FileResource,
              private projectService: ProjectService) {

    this.files = [];
    this.selectedFiles = new Selectable(this.files, 'name');
    this.progress = 0;
    this.filesToUpload = null;

    // load all files
    this.fileResource.getAll(this.project.id)
      .then(files => {
        this.files = files;
        this.selectedFiles = new Selectable(this.files, 'name');
      })
      .catch(err => {
        this.toastService.danger(`Fetching all files failed! ${err.data.message}`);
      });
  }

  /**
   * Remove a single file from the server and the list.
   *
   * @param file The name of the file to delete.
   */
  deleteFile(file: UploadableFile): void {
    this.fileResource.remove(this.project.id, file)
      .then(() => {
        this.toastService.success(`File "${file.name}" has been deleted.`);
        remove(this.files, {id: file.id});
        this.selectedFiles.unselect(file);
      })
      .catch(err => {
        this.toastService.danger(`The file could not be deleted. ${err.data.message}`);
      });
  }

  /**
   * Upload all chosen files piece by piece and add successfully deleted files to the list.
   */
  upload(): void {
    let error = false;
    const countFiles = this.files.length;

    let next;
    next = () => {
      this.progress = 0;
      if (this.filesToUpload.length > 0) {
        const file = this.filesToUpload[0];
        this.Upload.upload({
          url: `${apiUrl}/projects/${this.project.id}/files/upload`,
          file: file
        }).progress(evt => {
          this.progress = parseInt('' + (100.0 * evt.loaded / evt.total));
        }).success(data => {
          this.filesToUpload.shift();
          this.files.push(UploadableFile.fromData(data));
          next();
        }).error(() => {
          error = true;
          this.filesToUpload.shift();
          next();
        });
      } else {
        if (this.files.length === countFiles) {
          this.toastService.danger('<strong>Upload failed</strong><p>No file could be uploaded</p>');
        } else {
          if (error) {
            this.toastService.info('Some files could not be uploaded');
          } else {
            this.toastService.success('All files uploaded successfully');
          }
        }
      }
    };

    next();
  }

  /**
   * Batch delete selected files.
   */
  deleteSelectedFiles(): void {
    const selectedFiles = this.selectedFiles.getSelected();
    if (selectedFiles.length === 0) {
      this.toastService.info('You have to select at least one file');
    } else {
      this.fileResource.removeMany(this.project.id, selectedFiles)
        .then(() => {
          this.toastService.success(`The files have been deleted.`);
          selectedFiles.forEach(file => remove(this.files, {id: file.id}));
          this.selectedFiles.unselectMany(selectedFiles);
        })
        .catch(err => {
          this.toastService.danger(`The files could not be deleted. ${err.data.message}`);
        });
    }
  }

  /**
   * Downloads a file.
   *
   * @param file The file to download.
   */
  downloadFile(file: UploadableFile): void {
    this.fileResource.download(this.project.id, file)
      .then(response => {
        const blob = response.data;
        const objectUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = file.name;
        a.click();

        window.URL.revokeObjectURL(objectUrl);
      });
  }

  get project(): Project {
    return this.projectService.store.currentProject;
  }
}

export const filesViewComponent = {
  controller: FilesViewComponent,
  controllerAs: 'vm',
  template: require('./files-view.component.html')
};
