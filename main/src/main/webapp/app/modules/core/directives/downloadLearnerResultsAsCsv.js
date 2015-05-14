(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('downloadLearnerResultsAsCsv', downloadLearnerResultsAsCsv);

    downloadLearnerResultsAsCsv.$inject = ['FileDownloadService', 'LearnResultResource'];

    /**
     * The directive to download statistics from learner results as csv file. Attaches a click event to the directives
     * element that starts the download.
     *
     * Expects an attribute "results" which value should be the learn results to download.
     * Optional attribute "complete" with no value loads all steps of the first result and downloads these
     *
     * Use it like <button download-learner-results-as-csv results="...">Click Me!</button>
     *
     * @param FileDownloadService - The service to download files
     * @param LearnResultResource - The Resource for LearnResult
     * @returns {{restrict: string, scope: {results: string}, link: link}}
     */
    function downloadLearnerResultsAsCsv(FileDownloadService, LearnResultResource) {
        return {
            restrict: 'A',
            scope: {
                results: '='
            },
            link: link
        };
        function link(scope, el, attrs) {

            // download csv on click
            el.on('click', function () {
                if (angular.isDefined(scope.results)) {

                    // load all steps and load those
                    if (angular.isDefined(attrs.complete)) {
                        LearnResultResource.getComplete(scope.results[0].project, scope.results[0].testNo)
                            .then(function (results) {
                                FileDownloadService.downloadCSV(createCsvData(results));
                            })
                    } else {
                        FileDownloadService.downloadCSV(createCsvData(scope.results));
                    }
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
                    csv += results[i].project + ',';
                    csv += results[i].testNo + ',';
                    csv += '"' + results[i].statistics.startTime + '",';
                    csv += results[i].stepNo + ',';
                    csv += results[i].configuration.algorithm + ',';
                    csv += results[i].configuration.eqOracle.type + ',';
                    csv += results[i].configuration.symbols.length + ',';
                    csv += results[i].statistics.mqsUsed + ',';
                    csv += results[i].statistics.eqsUsed + ',';
                    csv += results[i].statistics.symbolsUsed + ',';
                    csv += results[i].statistics.duration + '\n';
                }

                return csv;
            }
        }
    }
}());