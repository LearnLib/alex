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

import {events} from "../constants";

/**
 * This component makes any element a place to drop files from the local pc. Currently this directive only
 * supports to read files as a text.
 *
 * Use: '<file-dropzone>some text to display</file-dropzone>'.
 */
class FileDropzone {

    /**
     * Constructor.
     *
     * @param $scope
     * @param $element
     * @param {EventBus} EventBus
     */
    // @ngInject
    constructor($scope, $element, EventBus) {
        this.$scope = $scope;
        this.$element = $element;
        this.EventBus = EventBus;

        /** The file reader */
        this.fileReader = new FileReader();

        // handle event when file has been loaded
        this.fileReader.addEventListener('load', this.onLoad.bind(this));

        // handle events on the component element
        this.$element.on('dragover', this.onDragover.bind(this));
        this.$element.on('drop', this.onDrop.bind(this));
        this.$element.on('click', this.onClick.bind(this));
    }

    /**
     * Is called when the file has been loaded.
     * Emits the loaded files to the EventBus.
     *
     * @param e - The event.
     */
    onLoad(e) {
        this.$scope.$apply(() => {
            if (this.onLoaded()) {
                this.onLoaded()(e.target.result);
            } else {
                this.EventBus.emit(events.FILE_LOADED, {
                    file: e.target.result
                });
            }
        });
    }

    /**
     * Open a file dialog on a click on the component.
     *
     * @param e - The event.
     */
    onClick(e) {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.addEventListener('change', e => {
            this.readFiles(e.target.files);
        }, false);
        input.click();
    }

    /**
     * Handle dragover event.
     *
     * @param e - The event.
     */
    onDragover(e) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
    }

    /**
     * Handle drop event.
     *
     * @param e - The event.
     */
    onDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.$element[0].style.outline = '0';
        this.readFiles(e.dataTransfer.files);
    }

    /**
     * Read all uploaded files as text.
     *
     * @param files - The files to upload.
     */
    readFiles(files) {
        for (let i = 0; i < files.length; i++) {
            this.fileReader.readAsText(files[i]);
        }
    }
}

export const fileDropzone = {
    controller: FileDropzone,
    transclude: true,
    bindings: {
        onLoaded: '&'
    },
    template: `
        <div class="alert alert-info" ng-transclude></div>
    `
};