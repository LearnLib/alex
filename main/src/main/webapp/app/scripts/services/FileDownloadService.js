(function () {
    'use strict';

    angular
        .module('ALEX.services')
        .factory('FileDownloadService', FileDownloadService);

    FileDownloadService.$inject = ['PromptService'];

    /**
     * The service that allows the file download of various filetypes: JSON, SVG, CSV. For each download, it prompts
     * the user for a filename of the downloadable file.
     *
     * @param PromptService - The service to create prompts with
     * @returns {{downloadJson: downloadJson, downloadCSV: downloadCSV, downloadSVG: downloadSVG}}
     * @constructor
     */
    function FileDownloadService(PromptService) {

        // the service
        return {
            downloadJson: downloadJson,
            downloadCSV: downloadCSV,
            downloadSVG: downloadSVG
        };

        // private functions

        /**
         * Downloads a file.
         *
         * @param {string} filename - The name of the file
         * @param {string} fileExtension - The file extension of the file
         * @param {string} href - The contents of the href attribute which holds the data of the file
         * @private
         */
        function _download(filename, fileExtension, href) {

            // create new link element with downloadable
            var a = document.createElement('a');
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
        function _prompt(fileExtension) {
            return PromptService.prompt('Enter a name for the ' + fileExtension + ' file.', {
                regexp: /^[a-zA-Z0-9\.\-,_]+$/,
                errorMsg: 'The name may not be empty and only consist of letters, numbers and the symbols ",._-".'
            })
        }

        // available service functions

        /**
         * Downloads an object as a json file. Prompts for a file name.
         *
         * @param {Object} jsonObject - The object that should be downloaded
         */
        function downloadJson(jsonObject) {
            _prompt('JSON')
                .then(function (filename) {
                    var href = 'data:text/json;charset=utf-8,' + encodeURIComponent(angular.toJson(jsonObject));
                    _download(filename, 'json', href);
                })
        }

        /**
         * Downloads a given string as csv file. Prompts for a filename.
         *
         * @param {string} csv - The string that represents the csv
         */
        function downloadCSV(csv) {
            _prompt('CSV')
                .then(function (filename) {
                    var href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
                    _download(filename, 'csv', href);
                })
        }

        /**
         * Downloads a SVG element as a svg file. Prompts for a filename.
         *
         * @param {*|HTMLElement} svg - The svg element that should be downloaded
         */
        function downloadSVG(svg) {
            _prompt('SVG')
                .then(function (filename) {

                    // set proper xml attributes for downloadable file
                    svg.setAttribute('version', '1.1');
                    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

                    // create serialized string from svg element and encode it in
                    // base64 otherwise the file will not be completely downloaded
                    // what results in errors opening the file
                    var svgString = new XMLSerializer().serializeToString(svg);
                    var href = 'data:image/svg+xml;base64,\n' + window.btoa(svgString);

                    _download(filename, 'svg', href);
                })
        }
    }
}());