(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('downloadLearnerResultsAsCsv', downloadLearnerResultsAsCsv);

    downloadLearnerResultsAsCsv.$inject = ['PromptService', '_'];

    /**
     * @param PromptService
     * @param _ - Lodash
     * @returns {{restrict: string, scope: {results: string}, link: link}}
     */
    function downloadLearnerResultsAsCsv(PromptService, _) {

        var directive = {
            restrict: 'A',
            scope: {
                results: '='
            },
            link: link
        };
        return directive;
        
        function link(scope, el, attrs) {

            el.on('click', handleDirectiveBehavior);

            /**
             * Prompts for a filename of the csv file and calls the method to download the file on success
             */
            function handleDirectiveBehavior() {
                var csvData = '';

                if (angular.isDefined(scope.results)) {
                    csvData = createCsvData(scope.results);
                    PromptService.prompt('Enter a name for the csv file.', {
                        regexp: /^[a-zA-Z0-9\.\-,_]+$/,
                        errorMsg: 'The name may not be empty and only consist of letters, numbers and the symbols ",._-".'
                    }).then(function (filename) {
                        download(csvData, filename)
                    });
                }
            }

            /**
             * Creates a csv string from learner results
             *
             * @param results - The learner results
             * @returns {string} - The csv string from learner results
             */
            function createCsvData(results) {
                var csv = 'Project,Test No,Start Time,Step No,Algorithm,Eq Oracle,Symbols,Resets,Duration (ms)\n';

                console.log(results)

                _.forEach(results, function (result) {
                    csv += result.project + ',';
                    csv += result.testNo + ',';
                    csv += '"' + result.startTime + '",';
                    csv += result.stepNo + ',';
                    csv += result.configuration.algorithm + ',';
                    csv += result.configuration.eqOracle.type + ',';
                    csv += result.configuration.symbols.length + ',';
                    csv += result.amountOfResets + ',';
                    csv += result.duration + '\n';
                });

                return csv;
            }

            /**
             * Downloads the csv file with learner results
             *
             * @param csv - The csv that should be downloaded
             * @param filename - The name of the csv file
             */
            function download(csv, filename) {

                // create new link element with downloadable csv
                var a = document.createElement('a');
                a.style.display = 'none';
                a.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
                a.setAttribute('target', '_blank');
                a.setAttribute('download', filename + '.csv');

                // append link to the dom, fire click event and remove it
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        }
    }
}());