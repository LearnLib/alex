/*
 * Copyright 2016 TU Dortmund
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

/** The controller of the files page */
// @ngInject
class FilesView {

    /**
     * Constructor
     * @param Upload
     * @param ToastService
     * @param SessionService
     * @param FileResource
     */
    constructor(Upload, ToastService, SessionService, FileResource) {
        this.Upload = Upload;
        this.ToastService = ToastService;
        this.SessionService = SessionService;
        this.FileResource = FileResource;

        /**
         * The project that is in the session
         * @type{Project}
         */
        this.project = SessionService.getProject();

        /**
         * All project related files
         * @type {{name: string, project: number}[]}
         */
        this.files = [];

        /**
         * The selected files
         * @type {{name: string, project: number}[]}
         */
        this.selectedFiles = [];

        /**
         * The progress in percent of the current uploading file
         * @type {number}
         */
        this.progress = 0;

        /**
         * The list of files to upload
         * @type {null|File[]}
         */
        this.filesToUpload = null;

        // load all files
        FileResource.getAll(this.project.id)
            .then(files => {
                this.files = files;
            })
            .catch(response => {
                if (response.status !== 404) {
                    this.ToastService.danger(`Fetching all files failed! ${response.data.message}`);
                }
            });
    }

    /**
     * Remove a single file from the server and the list
     * @param {string} file - The name of the file to delete
     */
    deleteFile(file) {
        this.FileResource.remove(this.project.id, file)
            .then(() => {
                this.ToastService.success('File "' + file.name + '" has been deleted');

                const i = this.files.findIndex(f => f.name === file.name);
                if (i > -1) this.files.splice(i, 1);
            });
    }

    /** Upload all chosen files piece by piece and add successfully deleted files to the list */
    upload() {
        let error = false;
        const countFiles = this.files.length;

        const next = () => {
            this.progress = 0;
            if (this.filesToUpload.length > 0) {
                const file = this.filesToUpload[0];
                this.Upload.upload({
                    url: '/rest/projects/' + this.project.id + '/files',
                    file: file
                }).progress(evt => {
                    this.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(data => {
                    this.filesToUpload.shift();
                    this.files.push(data);
                    next();
                }).error(() => {
                    error = true;
                    this.filesToUpload.shift();
                    next();
                });
            } else {
                if (this.files.length === countFiles) {
                    this.ToastService.danger('<strong>Upload failed</strong><p>No file could be uploaded</p>');
                } else {
                    if (error) {
                        this.ToastService.info('Some files could not be uploaded');
                    } else {
                        this.ToastService.success('All files uploaded successfully');
                    }
                }
            }
        };

        next();
    }

    /** Batch delete selected files */
    deleteSelectedFiles() {
        this.selectedFiles.forEach(file => {
            this.deleteFile(file);
        });
    }
}

export const filesView = {
    controller: FilesView,
    controllerAs: 'vm',
    templateUrl: 'views/pages/files.html'
};