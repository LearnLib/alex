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

import { environment as env } from '../../../environments/environment';
import { UploadableFile } from '../../entities/uploadable-file';
import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UploadProgress {
  progress: number;
  error: boolean;
  file: UploadableFile;
}

/**
 * The resource that handles API calls concerning the management of files.
 */
@Injectable()
export class FileApiService extends BaseApiService {

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Fetches all available files from the server that belong to a project.
   *
   * @param projectId The id of the project.
   */
  getAll(projectId: number): Observable<UploadableFile[]> {
    return this.http.get(`${env.apiUrl}/projects/${projectId}/files`, this.defaultHttpOptions)
      .pipe(
        map((body: any) => body.map(f => UploadableFile.fromData(f)))
      );
  }

  /**
   * Deletes a single file from the server.
   *
   * @param projectId The id of the project.
   * @param file The file object to be deleted.
   */
  remove(projectId: number, file: UploadableFile): Observable<any> {
    return this.http.delete(`${env.apiUrl}/projects/${projectId}/files/${file.id}`, this.defaultHttpOptions);
  }

  /**
   * Delete many files at once.
   *
   * @param projectId The ID of the project.
   * @param files The files to delete.
   */
  removeMany(projectId: number, files: UploadableFile[]): Observable<any> {
    const ids = files.map(f => f.id);
    return this.http.delete(`${env.apiUrl}/projects/${projectId}/files/batch/${ids.join(',')}`, this.defaultHttpOptions);
  }

  /**
   * Download a file.
   *
   * @param projectId The id of the project.
   * @param file The file to download.
   */
  download(projectId: number, file: UploadableFile): Observable<any> {
    const options = JSON.parse(JSON.stringify(this.defaultHttpOptions));
    options.responseType = 'blob';
    options.observe = 'response';

    return this.http.get(`${env.apiUrl}/projects/${projectId}/files/${file.id}/download`, options);
  }

  upload(projectId: number, file: File): Observable<UploadProgress> {
    const status = new BehaviorSubject<UploadProgress>({
      progress: 0,
      file: null,
      error: false
    });

    const formData = new FormData();
    formData.append('file', file, file.name);

    this.http.post(`${env.apiUrl}/projects/${projectId}/files/upload`, formData, {
      headers: this.defaultHttpHeaders,
      observe: 'events',
      reportProgress: true
    }).subscribe(
      e => {
        if (e.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * e.loaded / e.total);
          status.next({
            progress: percentDone,
            file: null,
            error: false
          });
        } else if (e instanceof HttpResponse) {
          const uploadedFile = UploadableFile.fromData(e.body);
          status.next({
            progress: 100,
            file: uploadedFile,
            error: false
          });
          status.complete();
        }
      },
      () => {
        status.next({
          progress: 100,
          file: null,
          error: true
        });
        status.complete();
      }
    );

    return status;
  }
}
