(function () {
    'use strict';

    angular
        .module('ALEX.controllers')
        .controller('FilesController', FilesController);

    /**
     * The controller that manages files of a project handles file uploads
     *
     * @param $scope - angular $scope
     * @param Upload - ngFileUpload Upload service
     * @param paths - The applications paths constant
     * @param ToastService - The ToastService
     * @param SessionService - The SessionService
     * @param FileResource - The Resource that handles API requests for files
     * @param _ - Lodash
     * @constructor
     */
    // @ngInject
    function FilesController($scope, Upload, paths, ToastService, SessionService, FileResource, _) {

        var project = SessionService.project.get();

        /**
         * All project related files
         * @type {{name: string, project: number}[]}
         */
        $scope.files = [];

        /**
         * The selected files
         * @type {{name: string, project: number}[]}
         */
        $scope.selectedFiles = [];

        /**
         * The progress in percent of the current uploading file
         * @type {number}
         */
        $scope.progress = 0;

        /**
         * The list of files to upload
         * @type {null|File[]}
         */
        $scope.filesToUpload = null;

        (function init() {
            FileResource.getAll(project.id)
                .then(function (files) {
                    $scope.files = files;
                }).catch(function () {

                });
        }());

        /**
         * Remove a single file from the server and the list
         *
         * @param {string} file - The name of the file to delete
         */
        $scope.deleteFile = function (file) {
            FileResource.delete(project.id, file)
                .then(function () {
                    ToastService.success('File "' + file.name + '" has been deleted');
                    _.remove($scope.files, function (f) {
                        return f.name === file.name;
                    });
                })
        };

        /**
         * Upload all chosen files piece by piece and add successfully deleted files to the list
         */
        $scope.upload = function () {
            var error = false;
            var countFiles = $scope.files.length;

            function next() {
                $scope.progress = 0;
                if ($scope.filesToUpload.length > 0) {
                    var file = $scope.filesToUpload[0];
                    Upload.upload({
                        url: '/rest/projects/' + project.id + '/files',
                        file: file
                    }).progress(function (evt) {
                        $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                    }).success(function (data) {
                        $scope.filesToUpload.shift();
                        $scope.files.push(data);
                        next();
                    }).error(function () {
                        error = true;
                        $scope.filesToUpload.shift();
                        next();
                    })
                } else {
                    if ($scope.files.length === countFiles) {
                        ToastService.danger('<strong>Upload failed</strong><p>No file could be uploaded</p>');
                    } else {
                        if (error) {
                            ToastService.info('Some files could not be uploaded');
                        } else {
                            ToastService.success('All files uploaded successfully');
                        }
                    }
                }
            }

            next();
        };

        /**
         * Batch delete selected files
         * TODO: call batch resource function as soon as there is an endpoint for that
         */
        $scope.deleteSelectedFiles = function () {
            _.forEach($scope.selectedFiles, $scope.deleteFile);
        }
    }
}());