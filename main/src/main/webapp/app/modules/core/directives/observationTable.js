(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('observationTable', observationTable);

    observationTable.$inject = ['paths'];

    /**
     * The directive that renders an observation table from an ascii representation into a html table. Can only be used
     * as a tag.
     *
     * Attribute 'data' should be the ascii string representation of the table from the LearnLib.
     *
     * Use: <observation-table data="..."></observation-table>
     *
     * @param paths - The applications paths constant
     * @returns {{restrict: string, scope: {data: string}, link: link, templateUrl: string}}
     */
    function observationTable(paths) {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            link: link,
            templateUrl: paths.COMPONENTS + '/core/views/directives/observation-table.html'
        };

        function link(scope, el, attrs) {

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
}());