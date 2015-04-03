(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('downloadLearnerResultsAsCsv', downloadLearnerResultsAsCsv);

    downloadLearnerResultsAsCsv.$inject = ['FileDownloadService'];

    /**
     * The directive to download statistics from learner results as csv file. Attaches a click event to the directives
     * element that starts the download.
     *
     * Expects an attribute "results" which value should be the learn results to download.
     *
     * Use it like <button download-learner-results-as-csv results="...">Click Me!</button>
     *
     * @param FileDownloadService - The service to download files
     * @returns {{restrict: string, scope: {results: string}, link: link}}
     */
    function downloadLearnerResultsAsCsv(FileDownloadService) {

        // the directive
        return {
            restrict: 'A',
            scope: {
                results: '='
            },
            link: link
        };

        // the directives behavior
        function link(scope, el, attrs) {

            // download csv on click
            el.on('click', function () {
                if (angular.isDefined(scope.results)) {
                    FileDownloadService.downloadCSV(createCsvData(scope.results));
                }
            });

            /**
             * Creates a csv string from learner results.
             *
             * @param {LearnResult[]} results - The learner results
             * @returns {string} - The csv string from learn results
             */
            function createCsvData(results) {
                var csv = 'Project,Test No,Start Time,Step No,Algorithm,Eq Oracle,|Sigma|,#MQs,#EQs,#Symbol Calls,Duration (ms)\n';

                for (var i = 0; i < results.length; i++) {
                    csv += result[i].project + ',';
                    csv += result[i].testNo + ',';
                    csv += '"' + result[i].statistics.startTime + '",';
                    csv += result[i].stepNo + ',';
                    csv += result[i].configuration.algorithm + ',';
                    csv += result[i].configuration.eqOracle.type + ',';
                    csv += result[i].configuration.symbols.length + ',';
                    csv += result[i].statistics.mqsUsed + ',';
                    csv += result[i].statistics.eqsUsed + ',';
                    csv += result[i].statistics.symbolsUsed + ',';
                    csv += result[i].statistics.duration + '\n';
                }

                return csv;
            }
        }
    }
}());