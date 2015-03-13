(function(){
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('observationTable', observationTable);

    observationTable.$inject = ['paths'];

    function observationTable(paths){

        return {
            scope: {
                data: '='
            },
            link: link,
            templateUrl: paths.views.DIRECTIVES + '/observation-table.html'
        };

        function link(scope, el, attrs) {
            scope.table = {
                header: [],
                body: []
            };

            scope.$watch('data', function(n){
                if (angular.isDefined(n)) {
                    createObservationTable();
                }
            });

            function createObservationTable(){
                var rows = scope.data.split('\n');

                if (rows.length > 1) {
                    for (var i = 1; i < rows.length; i+=2) {
                        rows[i] = rows[i].split('|');
                        rows[i].shift();
                        rows[i].pop();
                        for (var j = 0; j < rows[i].length; j++) {
                            rows[i][j] = rows[i][j].trim();
                        }
                        if (i === 1) {
                            scope.table.header = rows[i];
                        } else {
                            scope.table.body.push(rows[i]);
                        }
                    }
                }
            }
        }
    }
}());