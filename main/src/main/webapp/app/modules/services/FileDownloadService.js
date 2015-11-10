(function () {
    'use strict';

    /**
     * The service that allows the file download of various filetypes: JSON, SVG, CSV. For each download, it prompts
     * the user for a filename of the downloadable file.
     */
    // @ngInject
    class FileDownloadService {

        /**
         * Constructor
         * @param PromptService
         */
        constructor(PromptService) {
            this.PromptService = PromptService;
        }

        /**
         * Downloads a file.
         *
         * @param {string} filename - The name of the file
         * @param {string} fileExtension - The file extension of the file
         * @param {string} href - The contents of the href attribute which holds the data of the file
         * @private
         */
        download(filename, fileExtension, href) {

            // create new link element with downloadable
            const a = document.createElement('a');
            a.style.display = 'none';
            a.setAttribute('href', href);
            a.setAttribute('target', '_blank');
            a.setAttribute('download', filename + '.' + fileExtension);

            // append link to the dom, fire click event and remove it
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        /**
         * Opens a prompt dialog that asks for a file name.
         *
         * @param {string} fileExtension - The file extension of the file that should be downloaded
         * @returns {Promise} - The promise with the filename
         * @private
         */
        prompt(fileExtension) {
            return this.PromptService.prompt('Enter a name for the ' + fileExtension + ' file.', {
                regexp: /^[a-zA-Z0-9\.\-,_]+$/,
                errorMsg: 'The name may not be empty and only consist of letters, numbers and the symbols ",._-".'
            })
        }

        /**
         * Downloads an object as a json file. Prompts for a file name.
         *
         * @param {Object} jsonObject - The object that should be downloaded
         */
        downloadJson(jsonObject) {
            return this.prompt('JSON')
                .then(filename => {
                    const href = 'data:text/json;charset=utf-8,' + encodeURIComponent(angular.toJson(jsonObject));
                    this.download(filename, 'json', href);
                })
        }

        /**
         * Downloads a given string as csv file. Prompts for a filename.
         *
         * @param {string} csv - The string that represents the csv
         */
        downloadCSV(csv) {
            this.prompt('CSV')
                .then(filename => {
                    const href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
                    this.download(filename, 'csv', href);
                })
        }

        /**
         * Downloads a SVG element as a svg file. Prompts for a filename. The hole g element of the svg is downloaded
         * even if the g element is bigger than the svg element.
         *
         * @param {*|HTMLElement} svg - The svg element that should be downloaded
         * @param {boolean} adjustSize - If the element should be scaled down to its original size or not
         */
        downloadSVG(svg, adjustSize) {
            this.prompt('SVG')
                .then(filename => {

                    // copy svg to prevent the svg being clipped due to the window size
                    const svgCopy = svg.cloneNode(true);
                    const g = svg.childNodes[0];

                    // set proper xml attributes for downloadable file
                    svgCopy.setAttribute('version', '1.1');
                    svgCopy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

                    if (adjustSize) {
                        const scale = g.getTransformToElement(svg).a;
                        const dimension = svg.childNodes[0].getBoundingClientRect();
                        const width = Math.ceil(dimension.width / scale) + 20;    // use 20px as offset
                        const height = Math.ceil(dimension.height / scale) + 20;

                        svgCopy.setAttribute('width', width);
                        svgCopy.setAttribute('height', height);
                        svgCopy.childNodes[0].setAttribute('transform', 'translate(10,10)');
                    }

                    // create serialized string from svg element and encode it in
                    // base64 otherwise the file will not be completely downloaded
                    // what results in errors opening the file
                    const svgString = new XMLSerializer().serializeToString(svgCopy);
                    const href = 'data:image/svg+xml;base64,\n' + window.btoa(svgString);

                    this.download(filename, 'svg', href);
                })
        }
    }

    angular
        .module('ALEX.services')
        .factory('FileDownloadService', () => new FileDownloadService());
}());