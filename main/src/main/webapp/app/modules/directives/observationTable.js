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
 * The directive that renders an observation table from an ascii representation into a html table. Can only be used
 * as a tag.
 *
 * Attribute 'data' should be the ascii string representation of the table from the LearnLib.
 *
 * Use: <observation-table data="..."></observation-table>
 *
 * @returns {{restrict: string, scope: {data: string}, link: link, template: string}}
 */
// @ngInject
function observationTable() {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: link,
        template: `
            <table class="table table-condensed observation-table">
                <thead>
                <tr>
                    <th ng-repeat="th in table.header" ng-bind="th"></th>
                </tr>
                </thead>
                <tbody>
                <tr ng-repeat="tr in table.body.s1 track by $index">
                    <td ng-repeat="td in tr track by $index" ng-bind="td"></td>
                </tr>
                <tr ng-repeat="tr in table.body.s2 track by $index" ng-class="$index === 0 ? 'line': ''">
                    <td ng-repeat="td in tr track by $index" ng-bind="td"></td>
                </tr>
                </tbody>
            </table>
        `
    };

    function link(scope) {

        // the object of the table for the template
        scope.table = null;

        // render the observation table as soon as the data changes
        scope.$watch('data', function (n) {
            if (angular.isDefined(n)) {
                createObservationTable();
            }
        });

        /**
         * Parses the ascii representation of the observation table and stores it into scope.table
         */
        function createObservationTable() {

            // init table structure
            scope.table = {
                header: [],
                body: {
                    s1: [],
                    s2: []
                }
            };

            var rows = scope.data.split('\n');  // the rows of the table
            var marker = 0;                     // a flag that is used to indicate on which set of the table I am

            if (rows.length > 1) {
                for (var i = 0; i < rows.length - 1; i++) {

                    // +=====+======+ ... + is checked
                    // before the third occurrence of this pattern we are in set S\Sigma
                    // after that we are in set S
                    if (new RegExp('^(\\+\\=+)+\\+$').test(rows[i])) {
                        marker++;
                        continue;
                    }

                    // only check each second row because all others are only separators
                    if (i % 2 === 1) {

                        //remove column separators and white spaces around the entry content
                        rows[i] = rows[i].split('|');
                        rows[i].shift();
                        rows[i].pop();
                        for (var j = 0; j < rows[i].length; j++) {
                            rows[i][j] = rows[i][j].trim();
                        }

                        // fill the table
                        if (i === 1) {
                            scope.table.header = rows[i];
                        } else {

                            // depending on which set of the table i am
                            if (marker === 2) {
                                scope.table.body.s1.push(rows[i]);
                            } else {
                                scope.table.body.s2.push(rows[i]);
                            }
                        }
                    }
                }
            }
        }
    }
}

export default observationTable;