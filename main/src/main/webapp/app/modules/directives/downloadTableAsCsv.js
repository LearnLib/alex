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

/**
 * The directive that downloads a HTML table element as CSV. It attaches a click event to the directives element
 * which downloads the file. The directive must be used as an attribute.
 *
 * It expects one attribute 'ancestorOrElement' which should contain the selector to the table or the an ancestor
 * of the table.
 *
 * Use it like "<button download-table-as-csv="#table">Click Me!</button>"
 *
 * @param FileDownloadService - The service for downloading files
 * @returns {{restrict: string, scope: {downloadTableAsCsv: string}, link: link}}
 */
// @ngInject
function downloadTableAsCsv(FileDownloadService) {
    return {
        restrict: 'A',
        scope: {
            downloadTableAsCsv: '@'
        },
        link: link
    };

    function link(scope, el) {
        el.on('click', function () {

            // the table element
            var table;
            var csv;

            // find the downloadable table element
            if (scope.downloadTableAsCsv) {
                table = document.querySelector(scope.downloadTableAsCsv);
                if (table !== null && table.nodeName.toLowerCase() === 'table') {
                    csv = createCSV(table);
                } else {
                    table = table.querySelector('table');
                    if (table !== null) {
                        csv = createCSV(table);
                    }
                }

                // download it
                if (angular.isDefined(csv)) {
                    FileDownloadService.downloadCSV(csv);
                }
            }
        });

        /**
         * Creates CSV data from the entries of a HTML table element
         *
         * @param table - The table element that should be converted
         * @returns {string} - The table as CSV string
         */
        function createCSV(table) {
            const head = table.querySelectorAll('thead th');
            const rows = table.querySelectorAll('tbody tr');
            let csv = '';

            // add entries from table head
            if (head.length > 0) {
                for (let i = 0; i < head.length; i++) {
                    csv += head[i].textContent.replace(',', ' ') + (i === head.length - 1 ? '\n' : ',');
                }
            }

            // add entries from table row
            if (rows.length > 0) {
                for (let i = 0; i < rows.length; i++) {
                    var tds = rows[i].querySelectorAll('td');
                    if (tds.length > 0) {
                        for (let j = 0; j < tds.length; j++) {
                            csv += tds[j].textContent.replace(',', ' ') + (j === tds.length - 1 ? '\n' : ',');
                        }
                    }
                }
            }

            return csv;
        }
    }
}

export default downloadTableAsCsv;