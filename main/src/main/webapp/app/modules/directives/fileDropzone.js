import {events} from '../constants';

/**
 * This directives makes any element a place to drop files from the local pc. Currently this directive only
 * supports to read files as a text. It can only be used as an attribute.
 *
 * Use: '<div file-dropzone>' with function load(contents) { ... }
 *
 * @param EventBus
 * @return {{restrict: string, scope: {}, link: link}}
 */
// @ngInject
function fileDropzone(EventBus) {
    return {
        restrict: 'A',
        scope: {},
        link: link
    };

    function link(scope, el) {
        const reader = new FileReader();

        // call the callback as soon as a file is loaded
        reader.onload = function (e) {
            scope.$apply(() => {
                EventBus.emit(events.FILE_LOADED, {
                    file: e.target.result
                });
            });
        };

        // attach some styles to the element on dragover etc.
        el.on('dragover', e => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'copy';
        });

        el.on('dragenter', () => {
            el[0].style.outline = '2px solid rgba(0,0,0,0.2)';
        }).on('dragleave', () => {
            el[0].style.outline = '0';
        });

        el.on('drop', e => {
            e.preventDefault();
            e.stopPropagation();
            el[0].style.outline = '0';
            readFiles(e.dataTransfer.files);
        });

        // create input field and simulate click
        el.on('click', () => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.addEventListener('change', e => {
                const files = e.target.files;
                for (let i = 0; i < files.length; i++) {
                    reader.readAsText(files[i]);
                }
            }, false);
            input.click();
        });
    }
}

export default fileDropzone;