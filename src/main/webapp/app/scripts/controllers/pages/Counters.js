(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('CountersController', CountersController);

    CountersController.$inject = ['$scope', 'SessionService', 'CountersService', 'ToastService', '_'];

    /**
     * The controller for the page that lists all counters of a project in a list. It is also possible to delete them.
     *
     * Template: 'views/pages/counters.html';
     *
     * @param $scope - The projects scope
     * @param Session - The SessionService
     * @param Counters - The CountersService
     * @param Toast - The ToastService
     * @param _ - Lodash
     * @constructor
     */
    function CountersController($scope, Session, Counters, Toast, _) {

        // the sessions project
        var project = Session.project.get();

        /**
         * The counters of the project
         * @type {{name: string, value: number}[]}
         */
        $scope.counters = [{name: 'i', value: 0}, {name: 'j', value: 5}, {name: 'k', value: 1000}];

        /**
         * The selected counters objects
         * @type {{name: string, value: number}[]}
         */
        $scope.selectedCounters = [];

        // load all existing counters from the server
        (function init() {
            Counters.getAll(project.id)
                .then(function (counters) {
                    $scope.counters = counters;
                });
        }());

        /**
         * Delete a counter from the server and on success from scope
         *
         * @param {{name: string, value: number}} counter - The counter that should be deleted
         */
        $scope.deleteCounter = function (counter) {
            Counters.delete(project.id, counter.name)
                .then(function () {
                    Toast.success('Counter "' + counter.name + '" deleted');
                    _.remove($scope.counters, {name: counter.name});
                })
                .catch(function (response) {
                    Toast.danger('<p><strong>Deleting counter "' + counter.name + '" failed</strong></p>' + response.data.message);
                })
        };

        /**
         * Delete all selected counters from the server and on success from scope
         */
        $scope.deleteSelectedCounters = function () {
            if ($scope.selectedCounters.length > 0) {
                Counters.deleteSome(project.id, _.pluck($scope.counters, 'name'))
                    .then(function () {
                        Toast.success('Counters deleted');
                        _.forEach($scope.selectedCounters, function (counter) {
                            _.remove($scope.counters, {name: counter.name});
                        })
                    })
                    .catch(function (response) {
                        Toast.danger('<p><strong>Deleting counters failed</strong></p>' + response.data.message);
                    })
            }
        }
    }
}());