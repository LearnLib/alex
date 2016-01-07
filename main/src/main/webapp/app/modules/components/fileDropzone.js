import {events} from '../constants';

/**
 * This component makes any element a place to drop files from the local pc. Currently this directive only
 * supports to read files as a text.
 *
 * Use: '<file-dropzone>some text to display</file-dropzone>'
 */
// @ngInject
class FileDropzone {

    /**
     * Constructor
     * @param $scope
     * @param $element
     * @param EventBus
     */
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
     * Is called whem the file has been loaded.
     * Emits the loaded files to the EventBus
     * @param e - The event
     */
    onLoad(e) {
        this.$scope.$apply(() => {
            this.EventBus.emit(events.FILE_LOADED, {
                file: e.target.result
            });
        })
    }

    /**
     * Open a file dialog on a click on the component
     * @param e - The event
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
     * Handle dragover event
     * @param e - The event
     */
    onDragover(e) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
    }

    /**
     * Handle drop event
     * @param e - The event
     */
    onDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.$element[0].style.outline = '0';
        this.readFiles(e.dataTransfer.files);
    }

    /**
     * Read all uploaded files as text.
     * @param files
     */
    readFiles(files) {
        for (let i = 0; i < files.length; i++) {
            this.fileReader.readAsText(files[i]);
        }
    }
}

export const fileDropzone = {
    controller: FileDropzone,
    template: `
        <div class="alert alert-info" ng-transclude></div>
    `
};