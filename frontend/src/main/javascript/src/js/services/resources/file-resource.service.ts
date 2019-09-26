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

import { apiUrl } from '../../../../environments';
import { IHttpResponse, IHttpService, IPromise } from 'angular';
import { UploadableFile } from '../../entities/uploadable-file';

/**
 * The resource that handles API calls concerning the management of files.
 */
export class FileResource {

  /**
   * Constructor.
   *
   * @param $http
   */
  /* @ngInject */
  constructor(private $http: IHttpService) {
  }

  /**
   * Fetches all available files from the server that belong to a project.
   *
   * @param projectId The id of the project.
   */
  getAll(projectId: number): IPromise<UploadableFile[]> {
    return this.$http.get(`${apiUrl}/projects/${projectId}/files`)
      .then((response: IHttpResponse<any[]>) => response.data.map(d => UploadableFile.fromData(d)));
  }

  /**
   * Deletes a single file from the server.
   *
   * @param projectId The id of the project.
   * @param file The file object to be deleted.
   */
  remove(projectId: number, file: UploadableFile): IPromise<any> {
    return this.$http.delete(`${apiUrl}/projects/${projectId}/files/${file.id}`);
  }

  /**
   * Delete many files at once.
   *
   * @param projectId The ID of the project.
   * @param files The files to delete.
   */
  removeMany(projectId: number, files: UploadableFile[]): IPromise<any> {
    const ids = files.map(f => f.id);
    return this.$http.delete(`${apiUrl}/projects/${projectId}/files/batch/${ids.join(',')}`);
  }

  /**
   * Download a file.
   *
   * @param projectId The id of the project.
   * @param file The file to download.
   */
  download(projectId: number, file: UploadableFile): IPromise<any> {
    return this.$http.get(`${apiUrl}/projects/${projectId}/files/${file.id}/download`, {responseType: 'blob'});
  }
}
